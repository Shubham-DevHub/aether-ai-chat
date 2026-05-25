import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  BookOpen, 
  Terminal, 
  MessageSquare, 
  Database,
  Plus, 
  MoreVertical,
  Star,
  Paperclip,
  Trash2,
  FolderClosed
} from 'lucide-react';
import { ChatThread, AppSettings } from '../types';

interface RecentActivityProps {
  threads: ChatThread[];
  onSelectThread: (thread: ChatThread) => void;
  onDeleteThread: (threadId: string) => void;
  onStartNewChat: () => void;
  settings: AppSettings;
  onToggleStarThread: (threadId: string) => void;
}

export default function RecentActivity({
  threads,
  onSelectThread,
  onDeleteThread,
  onStartNewChat,
  settings,
  onToggleStarThread
}: RecentActivityProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);
  const [activeMenuThreadId, setActiveMenuThreadId] = useState<string | null>(null);

  // Filter threads dynamically
  const filteredThreads = threads.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.summary.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterStarredOnly) return !!t.isStarred;
    return true;
  });

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'coding':
        return (
          <div className="p-2.5 bg-theme-accent/10 rounded-xl border border-theme-accent/20 text-theme-accent">
            <Terminal className="w-5 h-5" />
          </div>
        );
      case 'creative':
        return (
          <div className="p-2.5 bg-amber-400/10 rounded-xl border border-amber-400/20 text-[#ffe179]">
            <BookOpen className="w-5 h-5" />
          </div>
        );
      case 'analysis':
        return (
          <div className="p-2.5 bg-[#4b8eff]/10 rounded-xl border border-[#4b8eff]/20 text-[#adc6ff]">
            <Database className="w-5 h-5" />
          </div>
        );
      case 'strategy':
        return (
          <div className="p-2.5 bg-theme-accent/10 rounded-xl border border-theme-accent/20 text-theme-accent">
            <FileText className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-gray-400">
            <MessageSquare className="w-5 h-5" />
          </div>
        );
    }
  };

  const toggleStar = (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    onToggleStarThread(threadId);
  };

  const handleOpenMenu = (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    setActiveMenuThreadId(activeMenuThreadId === threadId ? null : threadId);
  };

  const handleDelete = (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    onDeleteThread(threadId);
    setActiveMenuThreadId(null);
  };

  return (
    <div className="w-full">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-2">Recent Activity</h2>
          <p className="text-gray-400 text-lg">Manage your knowledge base and historical sessions.</p>
        </div>
        
        {/* Filter Input & Star Selector */}
        <div className="flex gap-3 w-full md:w-auto h-12">
          <div className="relative flex-grow md:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-[#1a1c20] border border-white/10 rounded-xl pl-11 pr-4 text-white text-sm focus:outline-none focus:border-theme-accent/50 transition-all placeholder:text-gray-500"
            />
          </div>
          <button 
            onClick={() => setFilterStarredOnly(!filterStarredOnly)}
            className={`glass-panel px-4 rounded-xl flex items-center gap-2 border hover:bg-white/10 transition-colors cursor-pointer text-sm font-semibold
              ${filterStarredOnly ? 'border-theme-accent text-theme-accent' : 'border-white/10 text-gray-300'}`}
          >
            <Filter className="w-4 h-4" />
            <span>{filterStarredOnly ? "Starred Only" : "Filter"}</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {filteredThreads.map((thread) => (
          <div 
            key={thread.id}
            onClick={() => onSelectThread(thread)}
            className={`glass-panel rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 group hover:-translate-y-1.5 hover:border-theme-accent/30 relative
              ${settings.neonGlow ? 'neon-glow-active' : ''}`}
          >
            {/* Card Header Info */}
            <div className="flex justify-between items-start">
              {getIconForCategory(thread.category)}
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => toggleStar(e, thread.id)}
                  className="p-1 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                  title={thread.isStarred ? "Unstar session" : "Star session"}
                >
                  <Star className={`w-4 h-4 transition-colors ${thread.isStarred ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-gray-400 opacity-60 hover:opacity-100'}`} />
                </button>

                <div className="relative">
                  <button 
                    onClick={(e) => handleOpenMenu(e, thread.id)}
                    className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4.5 h-4.5" />
                  </button>
                
                  {activeMenuThreadId === thread.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-zinc-900 border border-white/15 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                      <button 
                        onClick={(e) => handleDelete(e, thread.id)}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-white/5 flex items-center gap-2 smooth-hover cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Chat</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Core Summary Details */}
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-theme-accent transition-colors mb-1 line-clamp-1">
                {thread.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 min-h-[32px] opacity-75">
                {thread.summary}
              </p>
            </div>

            {/* Bottom segment */}
            <div className="mt-auto pt-4 flex justify-between items-center border-t border-white/5 text-xs text-gray-400">
              <span className="font-mono text-[10px] text-gray-500">{thread.updatedAt}</span>
              
              <div className="flex items-center gap-2">
                {thread.fileCount && (
                  <span className="flex items-center gap-1.5 font-medium text-[11px] text-gray-400 bg-white/5 border border-white/5 py-0.5 px-2 rounded">
                    <Paperclip className="w-3 h-3" />
                    <span>{thread.fileCount} files</span>
                  </span>
                )}
                {thread.category === 'creative' && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffe179] animate-ping"></span>
                    <span className="text-[11px] text-gray-400">Creative</span>
                  </span>
                )}
                {thread.isStarred && (
                  <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
                )}
                {thread.isArchived && (
                  <span className="text-[10px] tracking-wide font-bold uppercase py-0.5 px-2 bg-white/5 border border-white/5 rounded">
                    Archived
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Start New Session Blank dashed layout card */}
        <div 
          onClick={onStartNewChat}
          className="border-2 border-dashed border-white/10 hover:border-theme-accent/40 bg-zinc-900/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/5 transition-all duration-300 min-h-[190px] group"
        >
          <div className="w-11 h-11 rounded-full border border-dashed border-white/20 flex items-center justify-center group-hover:border-theme-accent/50 group-hover:scale-105 transition-all duration-300">
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-theme-accent" />
          </div>
          <p className="text-gray-400 font-medium text-sm group-hover:text-theme-accent transition-colors">
            Start New Session
          </p>
        </div>

      </div>
    </div>
  );
}
