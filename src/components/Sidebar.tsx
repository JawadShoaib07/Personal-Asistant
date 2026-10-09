'use client';

import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Settings, 
  Gift, 
  Crown, 
  Zap, 
  ShieldCheck,
  X,
  Camera
} from 'lucide-react';
import { ChatSession, PersonaId } from '../types/chat';
import { PERSONAS } from '../utils/aiEngine';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: (persona?: PersonaId) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onOpenSettings: () => void;
  onOpenRedeem: () => void;
  remainingTokens: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  userAvatar?: string;
  userName?: string;
  onUploadAvatar?: (base64: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenSettings,
  onOpenRedeem,
  remainingTokens,
  isOpenMobile,
  onCloseMobile,
  userAvatar,
  userName = 'Jawad Shoaib',
  onUploadAvatar,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formattedTokens = remainingTokens.toLocaleString();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-[#241d14] bg-[#08080a] backdrop-blur-2xl transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#241d14]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f3e5ab] via-[#d4af37] to-[#aa771c] p-[1px] shadow-md shadow-[#d4af37]/20">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0c0a08]">
                  <Crown className="h-4 w-4 text-[#d4af37]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white">
                    Personal Assistant
                  </span>
                  <span className="rounded bg-[#d4af37]/15 px-1.5 py-0.2 text-[9px] font-bold text-[#f3e5ab] border border-[#d4af37]/30">
                    GOLD
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                  <span className="text-[10px] text-[#c5a059] font-mono">
                    Gold Core • Online
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="rounded-lg p-1 text-[#c5a059] hover:text-white hover:bg-white/5 lg:hidden"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action: New Chat Button (Metallic Gold) */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa771c] px-3.5 py-2 text-xs font-black text-black shadow-md shadow-[#d4af37]/20 hover:brightness-105 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              <span className="tracking-wide">New Conversation</span>
            </div>
            <kbd className="hidden sm:inline rounded bg-black/25 px-1.5 py-0.5 font-mono text-[10px] text-black font-bold">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Search Input */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#c5a059]/50" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg bg-[#14100c] py-1.5 pl-8 pr-3 text-xs text-[#fcfaf6] placeholder-[#c5a059]/40 border border-[#271e15] focus:border-[#d4af37]/60 focus:bg-[#1a140f] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
          <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#c5a059]/60 uppercase">
            <span>Recent</span>
            <span className="font-mono text-[9px] text-[#c5a059]/50">{sessions.length}</span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-[#c5a059]/40">
              No conversations found.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const personaInfo = PERSONAS[session.persona] || PERSONAS.general;
              const isActive = session.id === activeSessionId;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onCloseMobile();
                  }}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-all ${
                    isActive
                      ? 'bg-[#d4af37]/15 text-[#f3e5ab] font-bold border-l-2 border-[#d4af37] shadow-sm'
                      : 'text-[#c5a059]/70 hover:bg-[#15110c] hover:text-[#fcfaf6] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden pr-2">
                    <span className="text-xs select-none">{personaInfo.avatar}</span>
                    <span className="truncate">{session.title}</span>
                  </div>

                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => onDeleteSession(session.id, e)}
                      className="p-1 rounded text-[#c5a059]/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 1 Billion Token Quota Widget */}
        <div className="m-3 rounded-xl border border-[#d4af37]/25 bg-[#14100c] p-3 shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-bold text-[#f3e5ab]">
                1B Token Pool
              </span>
            </div>
            <span className="flex items-center gap-1 text-[9px] font-bold text-[#f3e5ab] bg-[#d4af37]/20 px-1.5 py-0.5 rounded border border-[#d4af37]/30">
              <ShieldCheck className="h-2.5 w-2.5 text-[#d4af37]" /> Lifetime
            </span>
          </div>

          <div className="flex items-baseline justify-between text-xs font-mono font-bold text-white">
            <span className="text-[#f3e5ab]">{formattedTokens}</span>
            <span className="text-[10px] text-[#c5a059]/60">/ 1B</span>
          </div>

          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#aa771c] via-[#d4af37] to-[#f3e5ab] transition-all duration-300"
              style={{
                width: `${Math.max(
                  5,
                  Math.min(100, (remainingTokens / 1_000_000_000) * 100)
                )}%`,
              }}
            />
          </div>

          <button
            onClick={() => {
              onOpenRedeem();
              onCloseMobile();
            }}
            className="mt-2.5 flex w-full items-center justify-between rounded-lg bg-[#d4af37]/10 px-2.5 py-1.5 text-[11px] font-bold text-[#f3e5ab] hover:bg-[#d4af37]/20 border border-[#d4af37]/25 transition-all"
          >
            <span className="flex items-center gap-1.5">
              <Gift className="h-3.5 w-3.5 text-[#d4af37]" />
              Redeem Voucher
            </span>
            <span className="font-mono text-[10px] bg-[#d4af37]/20 text-[#f3e5ab] px-1.5 py-0.5 rounded font-black">
              4NV0PE
            </span>
          </button>
        </div>

        {/* User / Settings Footer Bar */}
        <div className="border-t border-[#241d14] p-3 flex items-center justify-between bg-[#0a0806]">
          {/* Hidden File Input for Avatar */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 5 * 1024 * 1024) {
                alert('Please select an image smaller than 5MB.');
                return;
              }
              const reader = new FileReader();
              reader.onload = (event) => {
                const base64 = event.target?.result as string;
                if (base64 && onUploadAvatar) {
                  onUploadAvatar(base64);
                }
              };
              reader.readAsDataURL(file);
              // reset so same file can be picked again if desired
              e.target.value = '';
            }}
          />

          <div className="flex items-center gap-2.5 min-w-0">
            {/* Clickable Profile Avatar with Hover Camera Overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg overflow-hidden border border-[#d4af37]/40 shadow-sm transition-transform hover:scale-105 active:scale-95 bg-[#14100c]"
              title="Click to upload profile photo"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-[#f3e5ab] via-[#d4af37] to-[#aa771c] text-black text-xs font-black">
                  {userName
                    ? userName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'JS'}
                </div>
              )}
              {/* Hover Camera Overlay */}
              <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="h-3.5 w-3.5 text-[#f3e5ab]" />
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#fcfaf6] leading-tight truncate">
                {userName}
              </span>
              <span className="text-[10px] text-[#c5a059]/70 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                Gold Executive
              </span>
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg p-1.5 text-[#c5a059] hover:text-[#f3e5ab] hover:bg-white/5 transition-colors"
              title="Upload profile picture"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                onOpenSettings();
                onCloseMobile();
              }}
              className="rounded-lg p-1.5 text-[#c5a059] hover:text-[#f3e5ab] hover:bg-white/5 transition-colors"
              title="Settings & Profile"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
