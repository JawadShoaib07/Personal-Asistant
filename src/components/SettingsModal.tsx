'use client';

import React, { useRef } from 'react';
import { X, Settings, Cpu, Volume2, Trash2, Key, Shield, User, Camera } from 'lucide-react';
import { UserSettings } from '../types/chat';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClearAllChats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearAllChats,
}) => {
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleModalAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        onUpdateSettings({ userAvatar: base64 });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-[#0d0a07] p-6 shadow-2xl text-[#fcfaf6]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#261d14] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f3e5ab] via-[#d4af37] to-[#aa771c] text-black shadow-md shadow-[#d4af37]/25">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Assistant Preferences</h2>
              <p className="text-xs text-[#c5a059]">Configure profile, model & voice settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#c5a059] hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="mt-5 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          
          {/* User Profile & Avatar Section */}
          <div className="rounded-xl border border-[#2e2316] bg-[#14100c] p-3.5">
            <label className="text-xs font-bold text-[#f3e5ab] flex items-center gap-1.5 mb-2.5">
              <User className="h-3.5 w-3.5 text-[#d4af37]" />
              Profile & Avatar Picture
            </label>
            
            <input
              type="file"
              ref={modalFileInputRef}
              accept="image/*"
              onChange={handleModalAvatarUpload}
              className="hidden"
            />

            <div className="flex items-center gap-3.5">
              {/* Avatar preview */}
              <div 
                onClick={() => modalFileInputRef.current?.click()}
                className="group relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-xl overflow-hidden border-2 border-[#d4af37]/60 shadow-md bg-[#0a0806] transition-transform hover:scale-105 active:scale-95"
                title="Click to change profile picture"
              >
                {settings.userAvatar ? (
                  <img
                    src={settings.userAvatar}
                    alt={settings.userName || 'Jawad Shoaib'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-[#f3e5ab] via-[#d4af37] to-[#aa771c] text-black text-sm font-black">
                    {(settings.userName || 'Jawad Shoaib')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="h-4 w-4 text-[#f3e5ab]" />
                </div>
              </div>

              {/* Profile Controls & Name */}
              <div className="flex-1 space-y-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-[#c5a059]/80 block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={settings.userName ?? 'Jawad Shoaib'}
                    onChange={(e) => onUpdateSettings({ userName: e.target.value })}
                    placeholder="Jawad Shoaib"
                    className="w-full rounded-lg bg-black/60 px-2.5 py-1 text-xs text-white placeholder-[#c5a059]/40 border border-[#2e2316] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa771c] px-2.5 py-1 text-[11px] font-bold text-black hover:brightness-105 active:scale-95 transition-all shadow-sm"
                  >
                    <Camera className="h-3 w-3" />
                    <span>Upload Photo</span>
                  </button>

                  {settings.userAvatar && (
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ userAvatar: undefined })}
                      className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/20 active:scale-95 transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Inference Provider */}
          <div>
            <label className="text-xs font-bold text-[#f3e5ab] flex items-center gap-1.5 mb-2">
              <Cpu className="h-3.5 w-3.5 text-[#d4af37]" />
              Inference Engine
            </label>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => onUpdateSettings({ apiProvider: 'simulated' })}
                className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                  settings.apiProvider === 'simulated'
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-white shadow-sm'
                    : 'border-[#261d14] bg-[#14100c] text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="font-bold text-white flex items-center justify-between w-full">
                  <span>Assistant Gold Core</span>
                  {settings.apiProvider === 'simulated' && (
                    <span className="text-[9px] bg-[#d4af37]/25 text-[#f3e5ab] px-1.5 py-0.5 rounded font-mono font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#c5a059]/80 mt-1">
                  1B Tokens included. Zero setup required.
                </div>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ apiProvider: 'openai' })}
                className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                  settings.apiProvider === 'openai'
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-white shadow-sm'
                    : 'border-[#261d14] bg-[#14100c] text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="font-bold text-white flex items-center justify-between w-full">
                  <span>Custom API Key</span>
                  {settings.apiProvider === 'openai' && (
                    <span className="text-[9px] bg-[#d4af37]/25 text-[#f3e5ab] px-1.5 py-0.5 rounded font-mono font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#c5a059]/80 mt-1">
                  Connect personal OpenAI or Gemini key.
                </div>
              </button>
            </div>
          </div>

          {/* Custom API Key input */}
          {settings.apiProvider === 'openai' && (
            <div className="rounded-xl border border-[#2e2316] bg-[#120e0a] p-3">
              <label className="text-xs font-semibold text-[#f3e5ab] flex items-center gap-1.5 mb-1.5">
                <Key className="h-3.5 w-3.5 text-[#d4af37]" />
                API Secret Key
              </label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={settings.apiKey || ''}
                onChange={(e) => onUpdateSettings({ apiKey: e.target.value })}
                className="w-full rounded-lg bg-black/50 px-3 py-1.5 text-xs text-white placeholder-[#c5a059]/40 border border-[#2e2316] focus:border-[#d4af37] focus:outline-none font-mono"
              />
            </div>
          )}

          {/* Voice Speech Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-[#261d14] bg-[#14100c] p-3">
            <div className="flex items-center gap-2.5">
              <Volume2 className="h-4 w-4 text-[#d4af37]" />
              <div>
                <div className="text-xs font-bold text-white">Voice Audio Playback</div>
                <div className="text-[11px] text-[#c5a059]/80">
                  Allow assistant to read responses aloud
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableVoice}
              onChange={(e) => onUpdateSettings({ enableVoice: e.target.checked })}
              className="h-4 w-4 rounded border-gray-700 text-[#d4af37] focus:ring-[#d4af37] bg-white/10 cursor-pointer"
            />
          </div>

          {/* Security badge */}
          <div className="flex items-center justify-between rounded-xl border border-[#261d14] bg-[#120e0a] p-2.5 text-xs text-gray-400">
            <span className="flex items-center gap-1.5 text-[#f3e5ab]">
              <Shield className="h-3.5 w-3.5 text-emerald-400" /> Privacy Protected
            </span>
            <span className="text-[10px] text-[#c5a059] font-mono">Local Browser Storage</span>
          </div>

          {/* Clear history */}
          <div className="pt-1">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all conversation history?')) {
                  onClearAllChats();
                  onClose();
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Conversation History
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa771c] px-4 py-1.5 text-xs font-black text-black hover:brightness-105 transition-all shadow-md active:scale-95"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
