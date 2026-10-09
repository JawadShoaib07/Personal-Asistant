'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ChatArea } from '../components/ChatArea';
import { RedeemModal } from '../components/RedeemModal';
import { SettingsModal } from '../components/SettingsModal';
import { ChatSession, PersonaId, UserSettings, Message } from '../types/chat';
import { generateSmartResponse } from '../utils/aiEngine';

const STORAGE_KEY_SESSIONS = 'muse_ai_sessions_v1';
const STORAGE_KEY_SETTINGS = 'muse_ai_settings_v1';
const INITIAL_TOKENS = 1_000_000_000;

const DEFAULT_SESSION: ChatSession = {
  id: 'chat-initial',
  title: 'New Conversation',
  persona: 'general',
  createdAt: 0,
  updatedAt: 0,
  messages: [],
};

const DEFAULT_SETTINGS: UserSettings = {
  apiProvider: 'simulated',
  streamingSpeed: 18,
  enableVoice: true,
  theme: 'dark',
  activeTokens: INITIAL_TOKENS,
  claimedCode: '4NV0PE',
  userName: 'Jawad Shoaib',
};

function createNewSession(persona: PersonaId = 'general'): ChatSession {
  const now = Date.now();
  return {
    id: `chat-${now}-${Math.random().toString(36).substring(2, 7)}`,
    title: 'New Conversation',
    persona,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([DEFAULT_SESSION]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(DEFAULT_SESSION.id);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [remainingTokens, setRemainingTokens] = useState<number>(INITIAL_TOKENS);
  const [isHydrated, setIsHydrated] = useState(false);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Streaming State
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingThinking, setStreamingThinking] = useState<string | undefined>(undefined);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
        }
      }

      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({
          ...prev,
          ...parsed,
          userName: parsed.userName || 'Jawad Shoaib',
        }));
        if (typeof parsed.activeTokens === 'number') {
          setRemainingTokens(parsed.activeTokens);
        }
      }
    } catch {
      // fallback
    }
    setIsHydrated(true);
  }, []);

  const createNewChat = useCallback((persona: PersonaId = 'general') => {
    const newSession = createNewSession(persona);
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, []);

  // Save sessions to localStorage only after hydration
  useEffect(() => {
    if (!isHydrated) return;
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    }
  }, [sessions, isHydrated]);

  // Save settings to localStorage only after hydration
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(
      STORAGE_KEY_SETTINGS,
      JSON.stringify({ ...settings, activeTokens: remainingTokens })
    );
  }, [settings, remainingTokens, isHydrated]);

  // Keyboard shortcut: Ctrl+K / Cmd+K for new chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        createNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createNewChat]);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;

  const stopStreaming = useCallback(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const handleSelectSession = (id: string) => {
    if (isStreaming) stopStreaming();
    setActiveSessionId(id);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    if (activeSessionId === id) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const handleSelectPersona = (persona: PersonaId) => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              persona,
              title: s.messages.length === 0 ? `Chat with ${persona}` : s.title,
            }
          : s
      )
    );
  };

  const handleSendMessage = (userPrompt: string) => {
    if (!activeSession) return;

    // 1. Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: userPrompt,
      timestamp: Date.now(),
    };

    const sessionTitle =
      activeSession.messages.length === 0
        ? userPrompt.slice(0, 32) + (userPrompt.length > 32 ? '...' : '')
        : activeSession.title;

    const updatedMessages = [...activeSession.messages, userMessage];

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              title: sessionTitle,
              messages: updatedMessages,
              updatedAt: Date.now(),
            }
          : s
      )
    );

    // 2. Generate AI Response
    setIsStreaming(true);
    setStreamingContent('');

    const aiPayload = generateSmartResponse(
      userPrompt,
      activeSession.persona
    );

    setStreamingThinking(aiPayload.thinking);

    // Simulate streaming chunks
    let currentIndex = 0;
    const fullText = aiPayload.response;
    const chunkSize = 3;

    streamIntervalRef.current = setInterval(() => {
      currentIndex += chunkSize;
      if (currentIndex >= fullText.length) {
        // Finished streaming
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
          streamIntervalRef.current = null;
        }

        const assistantMessage: Message = {
          id: `msg-ai-${Date.now()}`,
          sender: 'assistant',
          content: fullText,
          thinking: aiPayload.thinking,
          tokensUsed: aiPayload.tokensUsed,
          timestamp: Date.now(),
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id
              ? {
                  ...s,
                  messages: [...s.messages, assistantMessage],
                  updatedAt: Date.now(),
                }
              : s
          )
        );

        setRemainingTokens((prev) => Math.max(0, prev - aiPayload.tokensUsed));
        setIsStreaming(false);
        setStreamingContent('');
        setStreamingThinking(undefined);
      } else {
        setStreamingContent(fullText.slice(0, currentIndex));
      }
    }, settings.streamingSpeed || 15);
  };

  const handleApplyRedeemCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === '4NV0PE' || cleanCode === 'MUSE1B' || cleanCode === 'FREEMETHOD') {
      setRemainingTokens(1_000_000_000);
      setSettings((prev) => ({ ...prev, claimedCode: cleanCode }));
      return true;
    }
    return false;
  };

  const handleClearAllChats = () => {
    setSessions([]);
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
    createNewChat();
  };

  if (!activeSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09080a] text-[#c5a059]">
        Initializing Personal Assistant...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090a0f]">
      {/* Navigation Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSession.id}
        onSelectSession={handleSelectSession}
        onNewChat={createNewChat}
        onDeleteSession={handleDeleteSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRedeem={() => setIsRedeemOpen(true)}
        remainingTokens={remainingTokens}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        userAvatar={settings.userAvatar}
        userName={settings.userName || 'Jawad Shoaib'}
        onUploadAvatar={(base64) =>
          setSettings((prev) => ({ ...prev, userAvatar: base64 }))
        }
      />

      {/* Primary Workspace Chat Area */}
      <ChatArea
        session={activeSession}
        onSendMessage={handleSendMessage}
        onSelectPersona={handleSelectPersona}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        onOpenRedeem={() => setIsRedeemOpen(true)}
        isStreaming={isStreaming}
        streamingContent={streamingContent}
        streamingThinking={streamingThinking}
        onStopStreaming={stopStreaming}
        userAvatar={settings.userAvatar}
        userName={settings.userName || 'Jawad Shoaib'}
      />

      {/* 1 Billion Token Redeem Modal */}
      <RedeemModal
        isOpen={isRedeemOpen}
        onClose={() => setIsRedeemOpen(false)}
        onApplyCode={handleApplyRedeemCode}
        currentCode={settings.claimedCode}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) =>
          setSettings((prev) => ({ ...prev, ...newVals }))
        }
        onClearAllChats={handleClearAllChats}
      />
    </div>
  );
}
