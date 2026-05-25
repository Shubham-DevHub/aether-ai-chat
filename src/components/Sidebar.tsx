import React from 'react';
import { 
  PlusCircle, 
  FolderClosed, 
  Sparkles, 
  Cpu, 
  Settings, 
  HelpCircle,
  Zap
} from 'lucide-react';
import { AppSettings } from '../types';

interface SidebarProps {
  activeTab: 'chat' | 'library' | 'templates' | 'settings';
  setActiveTab: (tab: 'chat' | 'library' | 'templates' | 'settings') => void;
  onStartNewChat: () => void;
  settings: AppSettings;
  onOpenUpgradeModal: () => void;
  onOpenSupportModal: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onStartNewChat,
  settings,
  onOpenUpgradeModal,
  onOpenSupportModal
}: SidebarProps) {
  return (
    <aside 
      className={`h-full w-16 lg:w-64 fixed left-0 top-0 z-40 flex flex-col p-2 lg:p-4 border-r transition-all duration-300
        ${settings.theme === 'light' 
          ? 'bg-[#f0f2f5]/90 border-black/5 text-gray-800' 
          : 'bg-[#111318]/90 border-white/5 text-[#e2e2e8]'
        } backdrop-blur-2xl`}
    >
      {/* Brand Header */}
      <div className="flex items-center lg:items-start gap-3 mb-8 px-1 lg:px-2 mt-2 justify-center lg:justify-start">
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-theme-accent bg-theme-accent/10 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-theme-accent" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-theme-accent rounded-full border-2 border-black ai-pulse-dot"></span>
        </div>
        <div className="hidden lg:block animate-in fade-in duration-300">
          <h1 className="font-semibold text-lg leading-tight tracking-tight">Aether AI</h1>
          <p className="text-[10px] text-gray-400 tracking-wider">v2.4 Pro</p>
        </div>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 flex flex-col gap-1.5 items-center lg:items-stretch">
        {/* New Chat */}
        <button 
          onClick={onStartNewChat}
          className="flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 text-left w-10 h-10 lg:w-full lg:h-auto rounded-lg font-medium text-sm transition-all duration-200 hover:bg-white/5 group active:scale-95 text-theme-accent bg-white/5 hover:brightness-110 cursor-pointer"
          title="New Chat"
        >
          <PlusCircle className="w-5 h-5 group-hover:scale-105 transition-transform shrink-0" />
          <span className="hidden lg:block whitespace-nowrap">New Chat</span>
        </button>

        {/* Space separator */}
        <div className="h-4" />

        {/* Library Tab */}
        <button 
          onClick={() => setActiveTab('library')}
          className={`flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 text-left w-10 h-10 lg:w-full lg:h-auto rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer
            ${activeTab === 'library'
              ? (settings.theme === 'light' ? 'bg-black/10 text-black font-semibold' : 'bg-white/10 text-theme-accent font-semibold')
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          title="Library"
        >
          <FolderClosed className="w-5 h-5 shrink-0" />
          <span className="hidden lg:block whitespace-nowrap">Library</span>
        </button>

        {/* Templates Tab */}
        <button 
          onClick={() => setActiveTab('templates')}
          className={`flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 text-left w-10 h-10 lg:w-full lg:h-auto rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer
            ${activeTab === 'templates'
              ? (settings.theme === 'light' ? 'bg-black/10 text-black font-semibold' : 'bg-white/10 text-theme-accent font-semibold')
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          title="Templates"
        >
          <Sparkles className="w-5 h-5 shrink-0" />
          <span className="hidden lg:block whitespace-nowrap">Templates</span>
        </button>


      </nav>

      {/* Bottom Footer block */}
      <div className="mt-auto flex flex-col gap-1.5 items-center lg:items-stretch pt-4 border-t border-white/5 w-full">
        {/* Upgrade Banner Button */}
        <button 
          onClick={onOpenUpgradeModal}
          className="hidden lg:block w-full bg-theme-accent hover:brightness-110 text-black font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider mb-4 cursor-pointer btn-pulse transition-all duration-300 whitespace-nowrap"
        >
          Upgrade to Ultra
        </button>
        <button
          onClick={onOpenUpgradeModal}
          className="block lg:hidden w-10 h-10 bg-theme-accent hover:brightness-110 text-black p-2.5 rounded-lg mb-2.5 cursor-pointer btn-pulse transition-all duration-300"
          title="Upgrade to Ultra"
        >
          <Zap className="w-5 h-5 mx-auto" />
        </button>

        {/* Settings Tab */}
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-2.5 text-left w-10 h-10 lg:w-full lg:h-auto rounded-lg font-medium text-xs tracking-wide cursor-pointer
            ${activeTab === 'settings'
              ? (settings.theme === 'light' ? 'bg-black/10 text-black font-semibold' : 'bg-white/10 text-theme-accent font-semibold')
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          title="Settings"
        >
          <Settings className="w-4.5 h-4.5 shrink-0" />
          <span className="hidden lg:block whitespace-nowrap">Settings</span>
        </button>

        {/* Support Option */}
        <button 
          onClick={onOpenSupportModal}
          className="flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-2.5 text-left w-10 h-10 lg:w-full lg:h-auto rounded-lg text-gray-400 hover:text-white hover:bg-white/5 font-medium text-xs tracking-wide transition-all duration-200 cursor-pointer"
          title="Support"
        >
          <HelpCircle className="w-4.5 h-4.5 shrink-0" />
          <span className="hidden lg:block whitespace-nowrap">Support</span>
        </button>
      </div>
    </aside>
  );
}
