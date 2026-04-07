'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const history = messagesRef.current;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Placeholder del asistente para streaming
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: history.map((m) => ({ role: m.role, content: m.content })),
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
          { ...last, content: 'Lo siento, ocurrió un error. Intentá de nuevo.' },
        ];
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, loading, sendMessage, clearMessages };
}
