import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  HelpCircle, 
  History, 
  Sparkles,
  Zap,
  Check,
  Star,
  Trash2,
  FolderClosed,
  Settings as SettingsIcon,
  MessageSquare,
  ChevronRight,
  User,
  X
} from 'lucide-react';
import { ChatThread, ChatMessage, PromptTemplate, AppSettings } from './types';
import Sidebar from './components/Sidebar';
import PromptLibrary from './components/PromptLibrary';
import Personalization from './components/Personalization';
import RecentActivity from './components/RecentActivity';
import AetherChat from './components/AetherChat';

// Default pre-populated Historical Threads matching screenshot 3 exactly
const DEFAULT_THREADS: ChatThread[] = [
  {
    id: 'thread-alpha',
    title: 'Project Alpha Strategy',
    category: 'strategy',
    summary: 'Developing a comprehensive go-to-market plan for the new quantum computing suite including marketing vectors.',
    updatedAt: '2 hours ago',
    messages: [
      { id: 'm1', sender: 'user', text: 'Can you help draft our Project Alpha Strategy outline?', timestamp: '2 hours ago' },
      { id: 'm2', sender: 'ai', text: '### Project Alpha: Strategic Framework\n\nI have structured a comprehensive go-to-market plan covering core execution pipelines:\n\n1. **Value Proposition Mapping**: Emphasize low-latency quantum operations over standard silicon cloud arrays.\n2. **Target Demographics**: Prime targets include enterprise cryptographers, quantum material researchers, and high-frequency analytical networks.\n3. **Rollout Phases**: Chronological sequencing from developer beta sandboxing to final public API releases.', timestamp: '2 hours ago' }
    ],
    fileCount: undefined,
    isStarred: false,
    isArchived: false
  },
  {
    id: 'thread-creative',
    title: 'Creative Writing Prompts',
    category: 'creative',
    summary: 'Sci-fi world building exercises focusing on subterranean civilizations and bioluminescent flora.',
    updatedAt: 'Yesterday',
    messages: [
      { id: 'm1', sender: 'user', text: 'Give me some creative worldbuilding prompts about caves.', timestamp: 'Yesterday' },
      { id: 'm2', sender: 'ai', text: '### Subterranean Expeditions & Bioluminescence\n\nHere are three precision worldbuilding hooks to explore:\n\n* **The Sinking Horizon**: A civilization that lives on hanging structures anchored to the cavern ceiling, avoiding the toxic gas pooling on the floor.\n* **Luminous Flora Agronomy**: Detail how sub-levels rely on bioluminescent mushrooms to maintain agricultural cycles without solar exposure.', timestamp: 'Yesterday' }
    ],
    fileCount: undefined,
    isStarred: false,
    isArchived: false
  },
  {
    id: 'thread-refact-debug',
    title: 'API Refactoring Debug',
    category: 'coding',
    summary: 'Troubleshooting middleware latency issues in the Rust-based microservices architecture.',
    updatedAt: '3 days ago',
    messages: [
      { id: 'm1', sender: 'user', text: 'Help troubleshoot Rust backend latency overhead.', timestamp: '3 days ago' },
      { id: 'm2', sender: 'ai', text: '### Diagnostic Overlay: Middleware Latency\n\nDetected an unpooled allocation pattern causing recurrent stack degradation in connection states. Recommend swapping standard traits with raw futures.', timestamp: '3 days ago' }
    ],
    fileCount: 4,
    isStarred: false,
    isArchived: false
  },
  {
    id: 'thread-sync',
    title: 'Weekly Sync Notes',
    category: 'archived',
    summary: 'Summary of the design sprint and action items for the upcoming product launch.',
    updatedAt: 'Oct 24, 2023',
    messages: [
      { id: 'm1', sender: 'user', text: 'List action items for weekly sync.', timestamp: 'Oct 24, 2023' },
      { id: 'm2', sender: 'ai', text: '### Action Items: Sprint Sync\n\n* **Figma Drafts**: Lock down final high-fidelity templates for Settings and Prompt Library blocks.\n* **Server Integration**: Implement proxy routes for lazy api key calls.', timestamp: 'Oct 24, 2023' }
    ],
    fileCount: undefined,
    isStarred: false,
    isArchived: true
  },
  {
    id: 'thread-sql-opt',
    title: 'SQL Optimization Query',
    category: 'analysis',
    summary: 'Reviewing complex join statements for the analytics dashboard performance tuning.',
    updatedAt: 'Oct 20, 2023',
    messages: [
      { id: 'm1', sender: 'user', text: 'Check optimization queries.', timestamp: 'Oct 20, 2023' },
      { id: 'm2', sender: 'ai', text: '### Optimized SQL Indexes\n\nCreated composite keys on table partitions to stabilize response queries which reduces query execution latency by 45%.', timestamp: 'Oct 20, 2023' }
    ],
    fileCount: undefined,
    isStarred: true,
    isArchived: false
  }
];

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'midnight',
  glassIntensity: 75,
  neonGlow: true,
  selectedModel: 'ultra',
  crossSessionContext: true,
  username: 'Alexander Vance',
  userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'library' | 'templates' | 'settings'>('chat');
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Custom Overlay Modal States
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Dynamic responsive synchronization for our premium themes
  useEffect(() => {
    if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.style.setProperty('--glass-opacity', (settings.glassIntensity / 1000).toString());
  }, [settings.theme, settings.glassIntensity]);

  // Load from local storage on boot
  useEffect(() => {
    try {
      const persistedSettings = localStorage.getItem('aether_settings');
      if (persistedSettings) {
        const parsed = JSON.parse(persistedSettings);
        setSettings(parsed);
      } else {
        localStorage.setItem('aether_settings', JSON.stringify(DEFAULT_SETTINGS));
      }

      const persistedThreads = localStorage.getItem('aether_threads');
      if (persistedThreads) {
        setThreads(JSON.parse(persistedThreads));
      } else {
        setThreads(DEFAULT_THREADS);
        localStorage.setItem('aether_threads', JSON.stringify(DEFAULT_THREADS));
      }
    } catch (e) {
      console.error("Local storage sync failure, using default parameters:", e);
      setThreads(DEFAULT_THREADS);
    }
  }, []);

  // Save changes callback
  const handleSaveSettings = () => {
    localStorage.setItem('aether_settings', JSON.stringify(settings));
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('aether_settings', JSON.stringify(DEFAULT_SETTINGS));
    alert("Settings restored to system factory defaults!");
  };

  // Find active thread safely
  const activeThread = threads.find(t => t.id === activeThreadId) || null;

  // New Chat thread creator
  const handleStartNewChat = () => {
    setActiveThreadId(null);
    setActiveTab('chat');
    setIsMobileMenuOpen(false);
  };

  // Open Template directly inside chat
  const handleSelectTemplate = (template: PromptTemplate) => {
    // Create new thread automatically loaded with this template's workflow!
    const newThreadId = `thread-${Date.now()}`;
    const newThread: ChatThread = {
      id: newThreadId,
      title: template.title,
      category: template.category.toLowerCase(),
      summary: template.description,
      updatedAt: 'Just now',
      messages: [
        { id: `msg-${Date.now()}-1`, sender: 'user', text: template.promptText, timestamp: 'Just now' }
      ]
    };

    const updated = [newThread, ...threads];
    setThreads(updated);
    localStorage.setItem('aether_threads', JSON.stringify(updated));
    setActiveThreadId(newThreadId);
    setActiveTab('chat');
    
    // Automatically trigger calculation
    setIsLoading(true);
    triggerAICall(newThread.messages, newThreadId);
  };

  // Delete chat
  const handleDeleteThread = (threadId: string) => {
    const updated = threads.filter(t => t.id !== threadId);
    setThreads(updated);
    localStorage.setItem('aether_threads', JSON.stringify(updated));
    if (activeThreadId === threadId) {
      setActiveThreadId(null);
    }
  };

  // Select Thread from Library
  const handleSelectThread = (thread: ChatThread) => {
    setActiveThreadId(thread.id);
    setActiveTab('chat');
    setIsMobileMenuOpen(false);
  };

  // Trigger Gemini API Proxy Call
  const triggerAICall = async (currentMessages: ChatMessage[], targetThreadId: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: currentMessages,
          model: settings.selectedModel,
          systemInstruction: "You are Aether AI, a professional, helpful assistant. Answer questions clearly, write elegant code, and provide clear explanations without any simulated system logs, telemetry reports, latency metrics, memory allocations, or robotic cognitive optimization jargon."
        })
      });

      const data = await response.json();
      
      if (response.ok && data.text) {
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          sender: 'ai',
          text: data.text,
          timestamp: 'Just now'
        };

        setThreads(prevThreads => {
          const updated = prevThreads.map(t => {
            if (t.id === targetThreadId) {
              return {
                ...t,
                messages: [...t.messages, aiMessage],
                updatedAt: 'Just now'
              };
            }
            return t;
          });
          localStorage.setItem('aether_threads', JSON.stringify(updated));
          return updated;
        });

      } else {
        throw new Error(data.error || "Execution response yielded null text.");
      }
    } catch (err: any) {
      console.error("Endpoint transaction aborted:", err);
      
      // High quality local fallback description to prevent user lockouts!
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai-f`,
        sender: 'ai',
        text: `### Connection Notice: Offline Mode
 
Your app is currently running in offline simulation mode. To enable live AI responses using Gemini, please follow these steps:
 
*   **Configure API Key**: Provide a valid **GEMINI_API_KEY** inside your workspace environment variables.
*   **Predefined Workflows**: You can still use the **Prompt Library** templates and all offline chat presets seamlessly.`,
        timestamp: 'Just now'
      };

      setThreads(prevThreads => {
        const updated = prevThreads.map(t => {
          if (t.id === targetThreadId) {
            return {
              ...t,
              messages: [...t.messages, fallbackMsg],
              updatedAt: 'Just now'
            };
          }
          return t;
        });
        localStorage.setItem('aether_threads', JSON.stringify(updated));
        return updated;
      });

    } finally {
      setIsLoading(false);
    }
  };

  // Sending Chat message Handler
  const handleSendMessage = async (text: string, images?: string[]) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: 'Just now',
      images
    };

    let targetId = activeThreadId;

    if (!targetId) {
      // Derive nice title from prompt
      let title = text.replace(/\[Attached Reference.*\]/g, '').replace(/\[Attached Media.*\]/g, '').trim();
      const words = title.split(' ');
      if (words.length > 4) {
        title = words.slice(0, 4).join(' ') + '...';
      } else {
        title = title || 'Aether Session';
      }

      // Create new ChatThread
      targetId = `thread-${Date.now()}`;
      const newThread: ChatThread = {
        id: targetId,
        title,
        category: 'coding', // default template
        summary: text.substring(0, 80) + '...',
        updatedAt: 'Just now',
        messages: [userMessage]
      };

      const updated = [newThread, ...threads];
      setThreads(updated);
      localStorage.setItem('aether_threads', JSON.stringify(updated));
      setActiveThreadId(targetId);
      
      setIsLoading(true);
      await triggerAICall([userMessage], targetId);

    } else {
      // Append to existing thread
      let updatedMessages: ChatMessage[] = [];
      
      setThreads(prevThreads => {
        const updated = prevThreads.map(t => {
          if (t.id === targetId) {
            updatedMessages = [...t.messages, userMessage];
            return {
              ...t,
              messages: updatedMessages,
              updatedAt: 'Just now'
            };
          }
          return t;
        });
        localStorage.setItem('aether_threads', JSON.stringify(updated));
        return updated;
      });

      setIsLoading(true);
      await triggerAICall(updatedMessages, targetId);
    }
  };

  // Define premium dynamic thematic settings
  const getThemeBgClass = () => {
    switch (settings.theme) {
      case 'light':
        return 'bg-[#ffffff] text-gray-900 bg-[radial-gradient(circle_at_50%_-20%,#eff6ff_0%,#ffffff_60%)]';
      case 'aurora':
        return 'bg-[#010405] text-[#e2e2e8] bg-[radial-gradient(circle_at_50%_-20%,#115e59_0%,#060d0f_65%,#010405_100%)]';
      case 'emerald':
        return 'bg-[#010302] text-[#e2e2e8] bg-[radial-gradient(circle_at_50%_-15%,#022c22_0%,#050a08_65%,#010302_100%)]';
      case 'cyberpunk':
        return 'bg-[#040105] text-[#e2e2e8] bg-[radial-gradient(circle_at_50%_-20%,#4c0519_0%,#0d0411_65%,#040105_100%)]';
      case 'midnight':
      default:
        return 'bg-[#030206] text-[#e2e2e8] bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b_0%,#0b0a0f_60%,#030206_100%)]';
    }
  };

  const getThemeGlows = () => {
    switch (settings.theme) {
      case 'light':
        return { color1: 'bg-blue-400/5', color2: 'bg-indigo-300/4' };
      case 'aurora':
        return { color1: 'bg-cyan-400/5', color2: 'bg-teal-500/5' };
      case 'emerald':
        return { color1: 'bg-emerald-400/5', color2: 'bg-lime-400/4' };
      case 'cyberpunk':
        return { color1: 'bg-pink-500/6', color2: 'bg-rose-500/4' };
      case 'midnight':
      default:
        return { color1: 'bg-purple-400/6', color2: 'bg-indigo-500/6' };
    }
  };

  const glowColors = getThemeGlows();

  // Highlight star action
  const handleToggleStarThread = (threadId: string) => {
    const updated = threads.map(t => (t.id === threadId ? { ...t, isStarred: !t.isStarred } : t));
    setThreads(updated);
    localStorage.setItem('aether_threads', JSON.stringify(updated));
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-all duration-300 ${getThemeBgClass()}`}
    >
      
      {/* Absolute Atmospheric Glow Canvas Decorator */}
      {settings.theme !== 'light' && (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className={`absolute top-[8%] left-[20%] w-[35vw] h-[35vw] ${glowColors.color1} rounded-full blur-[130px]`} />
          <div className={`absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] ${glowColors.color2} rounded-full blur-[110px]`} />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.015] mix-blend-overlay" />
        </div>
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onStartNewChat={handleStartNewChat}
          settings={settings}
          onOpenUpgradeModal={() => setShowUpgradeModal(true)}
          onOpenSupportModal={() => setShowSupportModal(true)}
        />
      </div>

      {/* Main Canvas Page - Left padding for desktop sidebar */}
      <div className="md:ml-16 lg:ml-64 min-h-screen flex flex-col pt-16 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 transition-all duration-300">
        
        {/* Top Header Segment bar */}
        <header className="fixed top-0 left-0 md:left-16 lg:left-64 right-0 z-40 backdrop-blur-xl border-b border-white/10 bg-transparent h-16 transition-all duration-300">
          <div className="flex justify-between items-center h-full px-6 w-full max-w-7xl mx-auto">
            
            {/* Left Nav Header Options */}
            <div className="flex items-center gap-6">
              {/* Mobile Menu Toggle burger */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-white/5 rounded-lg text-theme-accent cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <span className="text-xl font-bold text-theme-accent tracking-tight block md:hidden">
                Aether AI
              </span>

              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => { setActiveTab('chat'); setActiveThreadId(null); }}
                  className={`font-semibold text-sm cursor-pointer border-b-2 py-1 smooth-hover
                    ${activeTab === 'chat' && !activeThreadId
                      ? 'text-theme-accent border-theme-accent' 
                      : 'text-gray-400 border-transparent hover:text-white'
                    }`}
                >
                  Models
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`font-semibold text-sm cursor-pointer border-b-2 py-1 smooth-hover
                    ${activeTab === 'settings' 
                      ? 'text-theme-accent border-theme-accent' 
                      : 'text-gray-400 border-transparent hover:text-white'
                    }`}
                >
                  Settings
                </button>
              </nav>
            </div>

            {/* Right Tools Group */}
            <div className="flex items-center gap-5">
              <button 
                onClick={() => setActiveTab('library')}
                className="p-1.5 text-gray-400 hover:text-theme-accent hover:bg-white/5 rounded-full transition-all cursor-pointer"
                title="Historical Log"
              >
                <History className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowSupportModal(true)}
                className="p-1.5 text-gray-400 hover:text-theme-accent hover:bg-white/5 rounded-full transition-all cursor-pointer"
                title="Support Core"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              
              {/* Account mini dropdown user profile image */}
              <div 
                onClick={() => setActiveTab('settings')}
                className="w-8 h-8 rounded-full overflow-hidden border border-white/20 cursor-pointer hover:border-theme-accent/50 smooth-hover"
              >
                <img 
                  src={settings.userAvatar} 
                  alt="Alexander Vance account profile" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

          </div>
        </header>

        {/* Dynamic Inner Tab Router Container */}
        <main className="flex-grow pt-8 pb-20 w-full relative z-10 animate-fade-in">
          {activeTab === 'chat' && (
            <AetherChat 
              activeThread={activeThread}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              settings={settings}
            />
          )}

          {activeTab === 'library' && (
            <RecentActivity 
              threads={threads}
              onSelectThread={handleSelectThread}
              onDeleteThread={handleDeleteThread}
              onStartNewChat={handleStartNewChat}
              settings={settings}
              onToggleStarThread={handleToggleStarThread}
            />
          )}

          {activeTab === 'templates' && (
            <PromptLibrary 
              onSelectTemplate={handleSelectTemplate} 
              settings={settings}
            />
          )}

          {activeTab === 'settings' && (
            <Personalization 
              settings={settings}
              setSettings={setSettings}
              onSave={handleSaveSettings}
              onReset={handleResetSettings}
            />
          )}
        </main>

      </div>

      {/* Mobile Sidebar overlay Menu Drawers */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Glass Overlay background */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
          />
          
          <div className="relative flex flex-col w-64 max-w-xs bg-zinc-950/95 border-r border-white/5 p-4 z-10 animate-fade-in-left">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Mobile Nav contents simply map to standard Sidebar tabs */}
            <div className="flex items-center gap-3 mb-8 px-2 mt-4">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ai-pulse-dot"></span>
              <h2 className="font-bold text-lg text-cyan-400">Aether Menu</h2>
            </div>

            <nav className="flex-1 flex flex-col gap-2">
              <button 
                onClick={handleStartNewChat}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg text-[#00f0ff] text-left text-sm font-semibold cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                <span>New Chat</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab('library'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold cursor-pointer
                  ${activeTab === 'library' ? 'bg-white/10 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
              >
                <FolderClosed className="w-5 h-5" />
                <span>Library</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab('templates'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold cursor-pointer
                  ${activeTab === 'templates' ? 'bg-white/10 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Templates</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold cursor-pointer
                  ${activeTab === 'settings' ? 'bg-white/10 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
              >
                <SettingsIcon className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </nav>

            <div className="mt-auto pt-4 border-t border-white/5">
              <button 
                onClick={() => { setShowUpgradeModal(true); setIsMobileMenuOpen(false); }}
                className="w-full bg-cyan-400 text-black py-2.5 rounded-xl font-bold uppercase text-[11px] tracking-wider mb-2 cursor-pointer btn-pulse btn-animated"
              >
                Upgrade Ultra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Tab bar layout */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full glass-panel z-40 flex justify-around items-center h-16 px-4 border-t border-white/10 bg-transparent backdrop-blur-3xl transition-colors duration-300">
        <button 
          onClick={handleStartNewChat}
          className={`flex flex-col items-center gap-1 cursor-pointer
            ${activeTab === 'chat' ? 'text-cyan-400' : 'text-gray-400'}`}
        >
          <MessageSquare className="w-5.5 h-5.5" />
          <span className="text-[9px] uppercase font-bold tracking-tight">Chats</span>
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          className={`flex flex-col items-center gap-1 cursor-pointer
            ${activeTab === 'templates' ? 'text-cyan-400' : 'text-gray-400'}`}
        >
          <Sparkles className="w-5.5 h-5.5" />
          <span className="text-[9px] uppercase font-bold tracking-tight">Templates</span>
        </button>
        <button 
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center gap-1 cursor-pointer
            ${activeTab === 'library' ? 'text-cyan-400' : 'text-gray-400'}`}
        >
          <FolderClosed className="w-5.5 h-5.5" />
          <span className="text-[9px] uppercase font-bold tracking-tight">Library</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 cursor-pointer
            ${activeTab === 'settings' ? 'text-cyan-400' : 'text-gray-400'}`}
        >
          <SettingsIcon className="w-5.5 h-5.5" />
          <span className="text-[9px] uppercase font-bold tracking-tight">Settings</span>
        </button>
      </nav>

      {/* Overlay modal: Upgrade Tier panel */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowUpgradeModal(false)} />
          <div className="relative glass-panel border border-cyan-400/30 w-full max-w-md rounded-2xl p-7 z-10 leading-relaxed text-left text-[#e2e2e8] animate-in zoom-in-95 duration-200 shadow-2xl">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <Zap className="w-10 h-10 text-cyan-400 mx-auto mb-3 animate-pulse" />
              <h3 className="text-xl font-extrabold text-white tracking-tight">Upgrade Aether to Ultra Tier</h3>
              <p className="text-xs text-gray-400 mt-1">Unlock raw reasoning parameters with zero rate limiting.</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-3 rounded-lg bg-cyan-400/5 border border-cyan-400/10 flex items-start gap-3">
                <Check className="w-4.5 h-4.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-200 font-semibold leading-relaxed">Unlimited queries with our model pipeline</span>
              </div>
              <div className="p-3 rounded-lg bg-cyan-400/5 border border-cyan-400/10 flex items-start gap-3">
                <Check className="w-4.5 h-4.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-200 font-semibold leading-relaxed">Dedicated prompt template workspace expansion</span>
              </div>
              <div className="p-3 rounded-lg bg-cyan-400/5 border border-cyan-400/10 flex items-start gap-3">
                <Check className="w-4.5 h-4.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-200 font-semibold leading-relaxed">Advanced memory parameter logs persistent offline</span>
              </div>
            </div>

            <button 
              onClick={() => { alert("Thank you for upgrading! Your system credentials are active."); setShowUpgradeModal(false); }}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-black py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Start Free 14-Day Trial
            </button>
          </div>
        </div>
      )}

      {/* Overlay modal: Support drawer help sheet */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowSupportModal(false)} />
          <div className="relative glass-panel border border-[#4b8eff]/30 w-full max-w-lg rounded-2xl p-7 z-10 text-[#e2e2e8] text-xs md:text-sm animate-in zoom-in-95 duration-200 shadow-2xl leading-relaxed text-left">
            <button 
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Aether Support Hub</h3>
            <p className="text-gray-400 mb-5 text-xs">Active diagnostic vectors are running in full-stack synchronization parameters.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <span className="font-bold text-cyan-400">Where can I apply my Gemini API Key?</span>
                <p className="text-gray-300 mt-1 text-xs">Aether AI executes server-side checks via process.env. If you have an active key, insert it in the Secrets manager in the side properties drawer and build successfully!</p>
              </div>
              <div>
                <span className="font-bold text-cyan-400">Can I switch visual styles directly?</span>
                <p className="text-gray-300 mt-1 text-xs">Yes! Simply open findings under the Settings/Personalization page and click Pristine Light or Midnight Glass themes.</p>
              </div>
              <div>
                <span className="font-bold text-cyan-400">Is database state fully persistent?</span>
                <p className="text-gray-300 mt-1 text-xs">Yes! Every new session created, message queried, or personalization property changed writes locally inside your browser localStorage pipeline so nothing is lost upon page Refresh.</p>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffe179] font-mono">System Core Status: Online</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
