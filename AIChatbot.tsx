
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { askGemini } from '../services/gemini';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: 'Hello! I am your Exam Assistant. How can I help you today? I can help generate questions for admins or explain topics for students.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const response = await askGemini(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] no-print">
      {isOpen ? (
        <div className="glass-panel w-96 h-[500px] rounded-[32px] border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-6 bg-gradient-to-r from-cyan-600 to-blue-600 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">AI Assistant</h4>
                <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-cyan-500' : 'bg-slate-800'}`}>
                    {m.role === 'user' ? <User size={16} className="text-slate-950" /> : <Bot size={16} className="text-cyan-400" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-cyan-500 text-slate-950 font-medium' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%] items-center text-slate-500 text-xs italic ml-11">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gemini is thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input 
              className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-2xl text-sm focus:border-cyan-500 transition-all outline-none"
              placeholder="Ask anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="p-3 bg-cyan-500 text-slate-950 rounded-2xl hover:bg-cyan-400 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/20 hover:scale-110 active:scale-95 transition-all group"
        >
          <Bot className="text-white w-8 h-8 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-slate-950 rounded-full"></div>
        </button>
      )}
    </div>
  );
};

export default AIChatbot;
