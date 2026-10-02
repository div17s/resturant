import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User, Utensils, Calendar, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface ConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReservation: () => void;
  onOpenMenu: () => void;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export const ConciergeModal = ({ isOpen, onClose, onOpenReservation, onOpenMenu }: ConciergeModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Namaste! I am Sia, your personal dining concierge at Olive & Restro. How can I assist you with our menu or table reservations today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Web Speech API for human-like interaction
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
          setInput(transcript);
        };

        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Speech start error:', e);
      }
    }
  };

  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Security: Hiding model logic behind our own API
      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error('Service unavailable');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      speakText(data.content);
    } catch (err) {
      const fallback = 'I am currently attending to another guest. Please feel free to browse our menu or use the direct reservation tool!';
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#1c222b] border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[620px]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className={`relative w-11 h-11 rounded-full ring-2 transition-all ${isSpeaking ? 'ring-amber-400 scale-105' : 'ring-stone-700'}`}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                alt="Aditi - Concierge"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="text-stone-100 font-serif font-medium text-lg">Sia</h3>
              <p className="text-stone-500 text-[10px] uppercase tracking-widest">AI Concierge</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`w-9 h-9 rounded-full flex items-center justify-center ${voiceEnabled ? 'bg-amber-500/10 text-amber-500' : 'bg-stone-800 text-stone-500'}`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-stone-800 rounded-full text-stone-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
              </div>
              <div className={`rounded-2xl px-4 py-3 text-sm max-w-[85%] ${msg.role === 'user' ? 'bg-stone-800 text-white rounded-tr-none' : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-stone-500 text-xs px-12">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-stone-900 border-t border-stone-800">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-full transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-stone-800 text-stone-400'}`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about our menu..."
              className="flex-1 bg-stone-950 border border-stone-800 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-all"
            />
            <button type="submit" disabled={!input.trim()} className="p-3 bg-amber-500 rounded-full text-stone-950 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
