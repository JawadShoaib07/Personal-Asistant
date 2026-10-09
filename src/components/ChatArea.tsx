'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Menu, 
  Square, 
  ArrowUp,
  Gift,
  Code2,
  Lightbulb,
  Languages,
  Check,
  Copy,
  Crown,
  ChevronDown
} from 'lucide-react';
import { ChatSession, PersonaId } from '../types/chat';
import { PERSONAS } from '../utils/aiEngine';
import { MessageItem } from './MessageItem';

interface ChatAreaProps {
  session: ChatSession;
  onSendMessage: (content: string) => void;
  onSelectPersona: (persona: PersonaId) => void;
  onOpenMobileMenu: () => void;
  onOpenRedeem: () => void;
  isStreaming: boolean;
  streamingContent: string;
  streamingThinking?: string;
  onStopStreaming: () => void;
  userAvatar?: string;
  userName?: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  session,
  onSendMessage,
  onSelectPersona,
  onOpenMobileMenu,
  onOpenRedeem,
  isStreaming,
  streamingContent,
  streamingThinking,
  onStopStreaming,
  userAvatar,
  userName,
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const currentPersona = PERSONAS[session.persona] || PERSONAS.general;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, streamingContent]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [input]);

  // Speech Recognition Setup
  const toggleListening = () => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('4NV0PE');
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2000);
  };

  // Clean, Simple Starter Prompts in Black & Gold
  const starterPrompts = [
    {
      title: '🎁 1 Billion Tokens Voucher',
      desc: 'Step-by-step instructions to claim tokens with 4NV0PE',
      prompt: 'How do I claim 1 Billion lifetime tokens with code 4NV0PE? Give me the complete step-by-step guide.',
      icon: <Gift className="h-4 w-4 text-[#d4af37]" />,
    },
    {
      title: '⚡ Code & Architecture',
      desc: 'Debug code, build APIs, and optimize algorithms',
      prompt: 'Write a clean TypeScript utility function with retry logic and error handling.',
      icon: <Code2 className="h-4 w-4 text-[#d4af37]" />,
    },
    {
      title: '💡 Strategy & Planning',
      desc: 'High-leverage work sprints and project roadmaps',
      prompt: 'Plan a high-focus 4-hour productive work routine for today.',
      icon: <Lightbulb className="h-4 w-4 text-[#d4af37]" />,
    },
    {
      title: '🇵🇰 Urdu / Roman Urdu Guide',
      desc: 'Tokens claim karne ka mukammal tareeqa Urdu mein',
      prompt: 'Tokens claim karne ka aasan tareeqa Roman Urdu mein batao.',
      icon: <Languages className="h-4 w-4 text-[#d4af37]" />,
    },
  ];

  return (
    <div className="flex flex-1 flex-col h-screen overflow-hidden bg-[#08080a] relative text-[#fcfaf6]">
      
      {/* Top Header Bar */}
      <header className="relative z-20 flex h-14 items-center justify-between border-b border-[#241d14] px-4 md:px-6 bg-[#0c0a08]/95 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="rounded-lg p-1.5 text-[#c5a059] hover:text-white hover:bg-white/5 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Custom Golden Model Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#c5a059] hidden sm:inline">Model:</span>
              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-2 rounded-lg bg-[#14100c] px-3 py-1.5 text-xs font-bold text-[#f3e5ab] border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#1a140e] transition-all shadow-sm"
              >
                <span>{currentPersona.avatar}</span>
                <span>{currentPersona.name}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-[#d4af37] transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Custom Golden Dropdown Menu (Zero Blue) */}
            {isModelDropdownOpen && (
              <div className="absolute left-0 sm:left-auto top-full mt-1.5 w-60 rounded-xl border border-[#d4af37]/40 bg-[#120e0a] p-1.5 shadow-2xl shadow-black z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-bold text-[#c5a059]/70 tracking-wider uppercase border-b border-[#241d14] mb-1">
                  Select AI Model
                </div>
                {(Object.keys(PERSONAS) as PersonaId[]).map((key) => {
                  const p = PERSONAS[key];
                  const isSelected = p.id === session.persona;

                  return (
                    <button
                      key={key}
                      onClick={() => {
                        onSelectPersona(key);
                        setIsModelDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-bold transition-all text-left ${
                        isSelected
                          ? 'bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40 shadow-sm'
                          : 'text-gray-300 hover:bg-[#d4af37]/10 hover:text-[#f3e5ab] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{p.avatar}</span>
                        <div>
                          <div className="text-xs font-bold">{p.name}</div>
                          <div className="text-[10px] font-normal text-[#c5a059]/70 line-clamp-1">{p.tagline}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#d4af37] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-lg bg-[#d4af37]/10 px-3 py-1 text-xs font-bold text-[#f3e5ab] border border-[#d4af37]/30 hover:bg-[#d4af37]/20 transition-all active:scale-95"
            title="Click to copy voucher code"
          >
            <Gift className="h-3.5 w-3.5 text-[#d4af37]" />
            <span className="text-[#c5a059]">Voucher:</span>
            <span className="font-mono text-white font-extrabold">4NV0PE</span>
            {copiedVoucher ? (
              <Check className="h-3 w-3 text-emerald-400 ml-0.5" />
            ) : (
              <Copy className="h-3 w-3 text-[#c5a059] ml-0.5" />
            )}
          </button>

          <button
            onClick={onOpenRedeem}
            className="hidden sm:inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold text-[#c5a059] hover:text-[#f3e5ab] hover:bg-white/5 transition-colors"
          >
            Guide
          </button>
        </div>
      </header>

      {/* Main Conversation Stream */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-3xl w-full mx-auto">
        {session.messages.length === 0 ? (
          // Clean & Professional Welcome Screen
          <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            
            {/* Clean Gold Logo Badge */}
            <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#f3e5ab] via-[#d4af37] to-[#aa771c] p-[1px] shadow-lg shadow-[#d4af37]/20">
              <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#0c0a08]">
                <Crown className="h-7 w-7 text-[#d4af37]" />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Personal Assistant
            </h1>
            <p className="mt-1.5 max-w-md text-sm text-[#c5a059]/90 leading-relaxed">
              {currentPersona.tagline}
            </p>

            {/* Clean Prompt Cards */}
            <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-2 text-left">
              {starterPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(item.prompt)}
                  className="group flex flex-col justify-between rounded-xl border border-[#271e15] bg-[#120e0a]/90 p-3.5 transition-all duration-200 hover:border-[#d4af37]/60 hover:bg-[#18130e] hover:shadow-md active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="rounded-lg bg-black/40 p-1.5 border border-[#271e15]">
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-[#f3e5ab] transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#c5a059]/80 leading-normal">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Render Messages
          <div className="space-y-4">
            {session.messages.map((message) => (
               <MessageItem
                 key={message.id}
                 message={message}
                 persona={session.persona}
                 userAvatar={userAvatar}
                 userName={userName}
               />
            ))}

            {/* Real-time Streaming Response Preview */}
            {isStreaming && (
              <MessageItem
                message={{
                  id: 'streaming-preview',
                  sender: 'assistant',
                  content: streamingContent || 'Generating response...',
                  thinking: streamingThinking,
                  timestamp: session.updatedAt,
                }}
                persona={session.persona}
                userAvatar={userAvatar}
                userName={userName}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Floating Control & Input Dock */}
      <footer className="relative z-20 p-3 md:p-4 bg-gradient-to-t from-[#08080a] via-[#08080a]/95 to-transparent">
        <div className="mx-auto max-w-3xl">
          
          {/* Active Voice Equalizer (Metallic Gold) */}
          {isListening && (
            <div className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-[#d4af37]/10 py-1.5 text-xs text-[#f3e5ab] border border-[#d4af37]/30">
              <span className="font-bold">Listening... speak now</span>
              <div className="flex items-center gap-1">
                <span className="wave-bar w-1 bg-[#d4af37] rounded-full inline-block" />
                <span className="wave-bar w-1 bg-[#d4af37] rounded-full inline-block" />
                <span className="wave-bar w-1 bg-[#d4af37] rounded-full inline-block" />
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="relative flex items-center rounded-2xl border border-[#2c2217] bg-[#120e0a] p-1.5 shadow-xl focus-within:border-[#d4af37]/70 focus-within:ring-1 focus-within:ring-[#d4af37]/40 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${currentPersona.name}...`}
              className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white placeholder-[#c5a059]/40 focus:outline-none"
            />

            <div className="flex items-center gap-1 pr-1">
              {/* Mic / Voice Input */}
              <button
                type="button"
                onClick={toggleListening}
                className={`rounded-xl p-2 transition-all ${
                  isListening
                    ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/40 animate-pulse'
                    : 'text-[#c5a059] hover:text-[#f3e5ab] hover:bg-white/5'
                }`}
                title="Voice Input"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              {/* Stop / Send Button */}
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopStreaming}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-[#f3e5ab] hover:bg-amber-500/30 transition-all"
                  title="Stop"
                >
                  <Square className="h-3.5 w-3.5 fill-[#d4af37]" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!input.trim()}
                  onClick={handleSend}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                    input.trim()
                      ? 'bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa771c] text-black shadow-md shadow-[#d4af37]/30 hover:brightness-105 active:scale-95'
                      : 'bg-[#1b150f] text-[#c5a059]/30 cursor-not-allowed'
                  }`}
                  title="Send"
                >
                  <ArrowUp className="h-4 w-4 stroke-[3]" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-1.5 flex items-center justify-between px-2 text-[10px] text-[#c5a059]/60">
            <span>Press Enter to send • 1 Billion Lifetime Tokens Active</span>
            <span className="font-mono text-[#d4af37]">4NV0PE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
