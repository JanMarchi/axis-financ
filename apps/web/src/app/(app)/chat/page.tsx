'use client';

import React, { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: '1', author: 'na_th', text: 'Oi! Sou a Na_th, sua copilota financeira. Como posso ajudar?' },
  ]);
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col h-screen bg-bg-base">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-elevated border-b border-border-subtle p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-lg">🤖</div>
          <div>
            <p className="font-medium text-text-primary">Na_th</p>
            <p className="text-xs text-text-tertiary">Copilota Financeira</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.author === 'user'
                  ? 'bg-brand-500 text-black'
                  : 'bg-bg-elevated border border-border-subtle text-text-primary'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-bg-elevated border-t border-border-subtle p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte à Na_th..."
            className="flex-1 px-4 py-2 rounded-input bg-bg-subtle border border-border-default text-text-primary text-sm"
          />
          <button className="px-4 py-2 rounded-btn bg-brand-500 text-black font-medium hover:bg-brand-400">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
