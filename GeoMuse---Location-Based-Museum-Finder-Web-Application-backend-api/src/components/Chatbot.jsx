import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya asisten virtual MuseumNesia. Ada yang bisa saya bantu terkait museum di Indonesia?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-lite-001',
          messages: [
            { role: 'system', content: 'Anda adalah asisten virtual pintar untuk aplikasi MuseumNesia. Tugas Anda adalah membantu pengguna menemukan informasi tentang museum di Indonesia, sejarah, dan fitur aplikasi seperti virtual tour dan live cam. Gunakan bahasa Indonesia yang ramah dan santun.' },
            ...messages,
            userMessage
          ]
        })
      });

      const data = await response.json();
      const botMessage = data.choices[0].message;
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi nanti.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="p-4 bg-emerald-500 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">MuseumNesia AI</p>
                <p className="text-[10px] opacity-80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500 text-white rounded-tr-none shadow-md' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <Bot size={16} className="text-slate-600 dark:text-slate-300" />
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700">
                    <Loader2 size={16} className="animate-spin text-emerald-500" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tanya sesuatu..."
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-white' : 'bg-emerald-500 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default Chatbot;
