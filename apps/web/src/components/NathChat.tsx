'use client';

import React, { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function NathChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const { request } = useApi();

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = input;
    setInput('');

    try {
      const response = await request<any>(
        '/ai/chat',
        'POST',
        { message: userMessage, sessionId },
      );

      if (response?.data) {
        setMessages((prev) => [
          ...prev,
          { id: `user_${Date.now()}`, role: 'user', content: userMessage },
          { id: `assistant_${Date.now()}`, role: 'assistant', content: response.data.reply },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-300">
      {/* Header */}
      <div className="border-b border-gray-300 p-4">
        <h2 className="text-lg font-bold">Na_th 🤖</h2>
        <p className="text-sm text-gray-600">Sua copilota financeira</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="mb-2">Olá! Sou Na_th, sua copilota financeira.</p>
            <p className="text-sm">Como posso ajudá-lo hoje?</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
              <p className="text-sm">Digitando...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-300 p-4 flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte algo sobre suas finanças..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>
    </div>
  );
}
