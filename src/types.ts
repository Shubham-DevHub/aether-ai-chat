export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  images?: string[];
}

export interface ChatThread {
  id: string;
  title: string;
  category: string;
  summary: string;
  updatedAt: string;
  messages: ChatMessage[];
  fileCount?: number;
  isStarred?: boolean;
  isArchived?: boolean;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Coding' | 'Writing' | 'Analysis';
  isFeatured?: boolean;
  icon: string;
  version?: string;
  tags?: string[];
  usedCount?: string;
  promptText: string;
}

export interface AppSettings {
  theme: 'midnight' | 'aurora' | 'emerald' | 'cyberpunk' | 'light';
  glassIntensity: number;
  neonGlow: boolean;
  selectedModel: 'ultra' | 'flash';
  crossSessionContext: boolean;
  username: string;
  userAvatar: string;
}
