'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function generateUUID(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getOrCreateSessionId(): string {
  const KEY = 'bw_session_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

function newSessionId(): string {
  const id = generateUUID();
  localStorage.setItem('bw_session_id', id);
  return id;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesRef = useRef<ChatMessage[]>([]);

  // Inicializar sessionId en el cliente (evita hydration mismatch)
  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const history = messagesRef.current;
      const userMsg: ChatMessage = {
        id: generateUUID(),
        role: 'user',
        content: text,
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      // Placeholder del asistente para streaming
      setMessages((prev) => [
        ...prev,
        { id: generateUUID(), role: 'assistant', content: '' },
      ]);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: history.map((m) => ({ role: m.role, content: m.content })),
            sessionId,
          }),
        });

        if (!response.ok) throw new Error('Error en el servidor');

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error('Sin stream');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last.role !== 'assistant') return prev;
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content + chunk },
            ];
          });
        }
      } catch {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.role !== 'assistant') return prev;
          return [
            ...prev.slice(0, -1),
            {
              ...last,
              content: 'Lo siento, ocurrió un error. Intentá de nuevo.',
            },
          ];
        });
      } finally {
        setLoading(false);
      }
    },
    [sessionId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSessionId(newSessionId());
  }, []);

  return { messages, loading, sendMessage, clearMessages, sessionId };
}
