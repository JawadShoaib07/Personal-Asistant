'use client';

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  Terminal, 
  User,
  Crown
} from 'lucide-react';
import { Message, PersonaId } from '../types/chat';
import { PERSONAS } from '../utils/aiEngine';

interface MessageItemProps {
  message: Message;
  persona: PersonaId;
  userAvatar?: string;
  userName?: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  persona, 
  userAvatar,
  userName,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showThinking, setShowThinking] = useState(false);

  const isAssistant = message.sender === 'assistant';
  const personaInfo = PERSONAS[persona] || PERSONAS.general;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleToggleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = message.content
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/[#*`_~]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Render markdown with code block parsing
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0]?.trim() || 'typescript';
        const codeText = lines.slice(1).join('\n') || lines[0] || '';
        const codeId = `code-${index}`;

        return (
          <div 
            key={index} 
            className="my-3 overflow-hidden rounded-xl border border-[#2e2316] bg-[#0a0907] shadow-xl"
          >
            {/* Mac OS Window Header */}
            <div className="flex items-center justify-between border-b border-[#211910] bg-[#14100b] px-3.5 py-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/80 inline-block" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d4af37]/80 inline-block" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/80 inline-block" />
                </div>
                <span className="ml-2 flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#f3e5ab]">
                  <Terminal className="h-3 w-3 text-[#d4af37]" />
                  {language}
                </span>
              </div>

              <button
                onClick={() => handleCopyCode(codeText, codeId)}
                className="flex items-center gap-1.5 rounded-md bg-[#241c12] px-2 py-1 text-[11px] font-bold text-[#f3e5ab] hover:bg-[#332719] transition-all active:scale-95 border border-[#3b2d1d]"
              >
                {copiedCodeId === codeId ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-[#c5a059]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="overflow-x-auto p-4 font-mono text-xs text-[#fcfaf6] leading-relaxed scrollbar-thin">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Format basic markdown styling for headers, bold, bullets
      const paragraphs = part.split('\n\n');
      return (
        <div key={index} className="space-y-2.5">
          {paragraphs.map((para, pIdx) => {
            if (!para.trim()) return null;

            // Header 3
            if (para.startsWith('### ')) {
              return (
                <h3 key={pIdx} className="text-[14px] font-bold text-[#f3e5ab] mt-3 mb-1 flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5 text-[#d4af37] inline" />
                  {para.replace('### ', '')}
                </h3>
              );
            }

            // Header 2
            if (para.startsWith('## ')) {
              return (
                <h2 key={pIdx} className="text-base font-bold text-white mt-4 mb-2 tracking-tight">
                  {para.replace('## ', '')}
                </h2>
              );
            }

            // Blockquote
            if (para.startsWith('> ')) {
              return (
                <blockquote
                  key={pIdx}
                  className="border-l-2 border-[#d4af37] bg-[#d4af37]/[0.08] px-3.5 py-2 text-xs italic text-[#f3e5ab] rounded-r-xl"
                >
                  {para.replace(/^>\s*/gm, '')}
                </blockquote>
              );
            }

            // Standard paragraph with inline formatting
            return (
              <p key={pIdx} className="leading-relaxed text-sm text-[#fcfaf6] whitespace-pre-wrap">
                {renderInlineStyles(para)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  const renderInlineStyles = (text: string) => {
    const boldRegex = /(\*\*.*?\*\*|`.*?`)/g;
    const tokens = text.split(boldRegex);

    return tokens.map((token, tIdx) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={tIdx} className="font-bold text-white">{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code key={tIdx} className="rounded-md bg-[#241c12] px-1.5 py-0.5 font-mono text-xs text-[#f3e5ab] border border-[#3b2d1d]">
            {token.slice(1, -1)}
          </code>
        );
      }
      return token;
    });
  };

  return (
    <div className={`flex w-full gap-3 py-2 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="relative flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-tr from-[#f3e5ab] via-[#d4af37] to-[#aa771c] text-black text-xs font-black shadow-md shadow-[#d4af37]/20 mt-1">
          <span>{personaInfo.avatar}</span>
          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#08080a]" />
        </div>
      )}

      {/* Message Card */}
      <div
        className={`relative max-w-2xl rounded-2xl px-4 py-3 shadow-md transition-all duration-200 ${
          isAssistant
            ? 'border border-[#2e2316] bg-[#110e0a]/95 text-[#fcfaf6] backdrop-blur-md shadow-black/40'
            : 'border border-[#d4af37]/35 bg-[#1a140e] text-[#fcfaf6] shadow-lg shadow-black/40'
        }`}
      >
        {/* Assistant Header Info */}
        {isAssistant && (
          <div className="mb-2 flex items-center justify-between border-b border-[#241a10] pb-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#f3e5ab]">
              <span>{personaInfo.name}</span>
            </div>
            {message.tokensUsed && (
              <span className="font-mono text-[10px] bg-[#d4af37]/15 text-[#f3e5ab] px-1.5 py-0.5 rounded border border-[#d4af37]/25">
                ⚡ {message.tokensUsed} tokens
              </span>
            )}
          </div>
        )}

        {/* Collapsible Chain of Thought */}
        {isAssistant && message.thinking && (
          <div className="mb-2.5 rounded-xl border border-[#d4af37]/25 bg-[#1b150e]/60 text-xs overflow-hidden">
            <button
              onClick={() => setShowThinking(!showThinking)}
              className="flex w-full items-center justify-between px-3 py-1.5 font-bold text-[#f3e5ab] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-1.5 text-[11px] tracking-wide">
                <Brain className="h-3.5 w-3.5 text-[#d4af37] animate-pulse" />
                REASONING PROCESS
              </span>
              {showThinking ? <ChevronUp className="h-3.5 w-3.5 text-[#c5a059]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#c5a059]" />}
            </button>
            {showThinking && (
              <div className="border-t border-[#2d2115] px-3 py-2 font-mono text-[11px] text-[#c5a059] whitespace-pre-wrap leading-relaxed bg-black/40">
                {message.thinking}
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="text-sm">
          {renderFormattedContent(message.content)}
        </div>

        {/* Bottom Actions for Assistant */}
        {isAssistant && (
          <div className="mt-2.5 flex items-center justify-between border-t border-[#241a10] pt-2 text-xs text-[#c5a059]">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMessage}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[#c5a059] hover:bg-white/5 hover:text-[#f3e5ab] transition-colors"
                title="Copy answer"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleToggleSpeak}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[#c5a059] hover:bg-white/5 hover:text-[#f3e5ab] transition-colors"
                title={isSpeaking ? 'Stop audio' : 'Listen aloud'}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-3 w-3 text-rose-400 animate-pulse" />
                    <span className="text-[11px] text-rose-400">Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3 w-3" />
                    <span className="text-[11px]">Read</span>
                  </>
                )}
              </button>
            </div>

            <span className="text-[10px] text-[#c5a059]/60 font-mono">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl overflow-hidden shadow-md border border-[#d4af37]/40 mt-1 bg-[#14100c]">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName || 'User'}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-[#3a2b1b] to-[#5a422a] text-[#f3e5ab] text-xs font-bold">
              <User className="h-4 w-4 text-[#d4af37]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
