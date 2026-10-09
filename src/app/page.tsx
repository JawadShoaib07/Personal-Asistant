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

function createInitialSession(persona: PersonaId = 'general'): ChatSession {
  return {
    id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: 'New Conversation',
    persona,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  };
}

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window === 'undefined') return [createInitialSession()];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [createInitialSession()];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id;
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const defaultSettings: UserSettings = {
      apiProvider: 'simulated',
      streamingSpeed: 18,
      enableVoice: true,
      theme: 'dark',
      activeTokens: INITIAL_TOKENS,
      claimedCode: '4NV0PE',
      userName: 'Jawad Shoaib',
    };
    if (typeof window === 'undefined') return defaultSettings;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved), userName: JSON.parse(saved).userName || 'Jawad Shoaib' };
      }
    } catch {
      // fallback
    }
    return defaultSettings;
  });

  const [remainingTokens, setRemainingTokens] = useState<number>(() => {
    if (typeof window === 'undefined') return INITIAL_TOKENS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.activeTokens === 'number') return parsed.activeTokens;
      }
    } catch {
      // fallback
    }
    return INITIAL_TOKENS;
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Streaming State
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingThinking, setStreamingThinking] = useState<string | undefined>(undefined);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const createNewChat = useCallback((persona: PersonaId = 'general') => {
    const newSession = createInitialSession(persona);
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    }
  }, [sessions]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_SETTINGS,
      JSON.stringify({ ...settings, activeTokens: remainingTokens })
    );
  }, [settings, remainingTokens]);

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
