'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, loading, sendMessage, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll al ultimo mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus al input cuando abre
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(id);
  }, [open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const WELCOME =
    '¡Hola! Soy el asistente de Bar Wise 🍺 ¿En qué te puedo ayudar? Podés preguntarme sobre el menú, precios, horarios o cualquier consulta del bar.';

  return (
    <>
      {/* Panel del chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 w-[340px] sm:w-[380px] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-200 bg-white"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-secondary-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  BW
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Bar Wise</p>
                  <p className="text-secondary-300 text-xs">Asistente virtual</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={clearMessages}
                    className="text-secondary-300 hover:text-white text-xs transition"
                    title="Limpiar chat"
                  >
                    Limpiar
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-secondary-300 hover:text-white transition text-lg leading-none"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 min-h-[200px] max-h-[400px]">
              {/* Mensaje de bienvenida */}
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-secondary-600 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-1">
                  BW
                </div>
                <div className="bg-white text-gray-800 rounded-2xl rounded-tl-sm px-3 py-2 text-sm shadow-sm max-w-[75%]">
                  {WELCOME}
                </div>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 bg-secondary-600 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-1">
                      BW
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm max-w-[75%] ${
                      msg.role === 'user'
                        ? 'bg-primary-500 text-white rounded-tr-sm'
                        : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                    }`}
                  >
                    {msg.content || (
                      <span className="flex gap-1">
                        <span className="animate-bounce delay-0">.</span>
                        <span className="animate-bounce delay-100">.</span>
                        <span className="animate-bounce delay-200">.</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-200 bg-white">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribí tu consulta..."
                disabled={loading}
                className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-8 h-8 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 rounded-full flex items-center justify-center transition flex-shrink-0"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boton flotante */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-secondary-600 hover:bg-secondary-700 rounded-full shadow-lg flex items-center justify-center transition"
        title="Consultar al asistente"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-white text-xl font-bold"
            >
              &times;
            </motion.span>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Badge de notificacion */}
        {!open && messages.length === 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full border-2 border-white" />
        )}
      </motion.button>
    </>
  );
}
