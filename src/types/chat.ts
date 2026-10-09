export type PersonaId = 'general' | 'coding' | 'creative' | 'productivity' | 'researcher';

export interface Persona {
  id: PersonaId;
  name: string;
  tagline: string;
  avatar: string;
  accentColor: string;
  systemPrompt: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: number;
  thinking?: string;
  tokensUsed?: number;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  persona: PersonaId;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export interface UserSettings {
  apiKey?: string;
  apiProvider: 'simulated' | 'openai' | 'gemini';
  streamingSpeed: number; // ms per chunk
  enableVoice: boolean;
  theme: 'dark' | 'neon' | 'midnight';
  activeTokens: number;
  claimedCode?: string;
  userAvatar?: string;
  userName?: string;
}
