import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  Paperclip, 
  ArrowRight,
  User,
  Zap,
  CheckCircle,
  FileCode,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  Image as ImageIcon,
  X,
  UploadCloud,
  Check,
  Trash2,
  Copy
} from 'lucide-react';
import { ChatMessage, ChatThread, AppSettings } from '../types';

interface AetherChatProps {
  activeThread: ChatThread | null;
  onSendMessage: (text: string, attachedImages?: string[]) => Promise<void>;
  isLoading: boolean;
  settings: AppSettings;
}

const PRESET_CHIPS = [
  "Analyze Codebase",
  "Draft Technical Specs",
  "Optimize Logic"
];

// Mock visual image presets - max selectable is 10
const IMAGE_PRESETS = [
  { id: 'img-1', name: 'UI Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=250&auto=format&fit=crop' },
  { id: 'img-2', name: 'Database Schema', url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=250&auto=format&fit=crop' },
  { id: 'img-3', name: 'Mobile Layout', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=250&auto=format&fit=crop' },
  { id: 'img-4', name: 'Analytical Graph', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=250&auto=format&fit=crop' },
  { id: 'img-5', name: 'Concept Wireframe', url: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=250&auto=format&fit=crop' },
  { id: 'img-6', name: 'System Architecture', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=250&auto=format&fit=crop' }
];

export default function AetherChat({
  activeThread,
  onSendMessage,
  isLoading,
  settings
}: AetherChatProps) {
  const [inputText, setInputText] = useState('');
  const [showAttachmentsMenu, setShowAttachmentsMenu] = useState(false);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleCopyText = (messageId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  // Auto scroll logic (stabilized on message changes)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && attachedImages.length === 0) return;

    let textToSend = inputText;
    if (attachedImages.length > 0) {
      textToSend += `\n[Attached Media: ${attachedImages.length} images]`;
    }

    setInputText('');
    setAttachedImages([]);
    setShowAttachmentsMenu(false);
    
    await onSendMessage(textToSend, attachedImages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectPreset = (preset: string) => {
    let presetText = "";
    if (preset === "Analyze Codebase") {
      presetText = "Can you help me analyze and solve our server stack latency? Check temporal and spatial stabilization algorithms.";
    } else if (preset === "Draft Technical Specs") {
      presetText = "Draft a comprehensive technical specification layout for building high-fidelity glassmorphism dashboard structures.";
    } else if (preset === "Optimize Logic") {
      presetText = "Deconstruct and optimize a TypeScript memoized async event routing controller loop to eliminate memory degradation.";
    } else {
      presetText = `Execute precision prompt metrics for: ${preset}`;
    }
    
    setInputText(presetText);
  };

  const toggleImagePreset = (url: string) => {
    if (attachedImages.includes(url)) {
      setAttachedImages(prev => prev.filter(item => item !== url));
    } else {
      if (attachedImages.length >= 10) {
        alert("Maximum upload limit reached! You can attach up to 10 images.");
        return;
      }
      setAttachedImages(prev => [...prev, url]);
    }
  };

  const handleCustomImageUpload = (file: File) => {
    if (attachedImages.length >= 10) {
      alert("Maximum upload limit reached! You can attach up to 10 images.");
      return;
    }
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachedImages(prev => {
            if (prev.length >= 10) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        handleCustomImageUpload(file);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        handleCustomImageUpload(file);
      });
    }
  };

  // Convert custom bold markdown to html inline format, simple parser for standard output tags
  const formatMessageText = (txt: string) => {
    // This maintains nice linebreaks, bullet lists, and basic headers inside React
    const lines = txt.split('\n');
    return lines.map((line, idx) => {
      // Check for code blocks
      if (line.trim().startsWith('```')) {
        return null; // Handle code blocks with dedicated syntax styling below
      }
      
      // Check for bullet lists
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const itemText = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc pl-1 py-0.5 text-xs md:text-sm text-gray-300">
            {parseInlineMarkdown(itemText)}
          </li>
        );
      }

      // Check for headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-base font-bold text-white mt-4 mb-2 tracking-tight">
            {line.substring(4)}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-theme-accent mt-5 mb-2.5 tracking-tight">
            {line.substring(3)}
          </h3>
        );
      }

      return (
        <p key={idx} className="mb-2 leading-relaxed text-xs md:text-sm text-gray-100">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  const parseInlineMarkdown = (text: string) => {
    // Matches **bold** text patterns
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-theme-accent font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Detect code snippet segments to render separately with JetBrains Mono code tags
  const renderMessageContent = (messageText: string) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(messageText)) !== null) {
      // Text before code block
      if (match.index > lastIndex) {
        parts.push(
          <div key={`text-${lastIndex}`} className="space-y-1">
            {formatMessageText(messageText.substring(lastIndex, match.index))}
          </div>
        );
      }

      // Code block content
      const codeLines = match[1].trim();
      parts.push(
        <div key={`code-${match.index}`} className="my-3 rounded-lg overflow-hidden border border-white/5 bg-[#0e1013] p-4 font-mono text-[11px] md:text-xs text-emerald-400">
          <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-wider mb-2 border-b border-white/5 pb-1.5">
            <span className="flex items-center gap-1.5"><FileCode className="w-3.5 h-3.5 text-theme-accent" /> SOURCE LOG</span>
            <span className="text-[9px]">UTC +04</span>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">{codeLines}</pre>
        </div>
      );

      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < messageText.length) {
      parts.push(
        <div key={`text-${lastIndex}`} className="space-y-1">
          {formatMessageText(messageText.substring(lastIndex))}
        </div>
      );
    }

    return parts;
  };

  const modelEngineText = settings.selectedModel === 'ultra' 
    ? 'Aether 1.5 Pro' 
    : 'Aether 1.5 Flash';

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] relative">
      
      {/* Scrollable Chat Container */}
      <div className="flex-grow overflow-y-auto pr-2 pb-6 space-y-6 scrollbar-hide">
        {activeThread && activeThread.messages.length > 0 ? (
          activeThread.messages.map((message) => {
            const isUser = message.sender === 'user';
            
            return (
              <motion.div 
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`flex gap-4 items-start ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-theme-accent animate-pulse" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`p-5 rounded-2xl max-w-[85%] border transition-all duration-300
                  ${isUser 
                    ? 'bg-white/5 border-white/10 rounded-tr-none text-white' 
                    : `${settings.theme === 'light' ? 'light-glass-panel text-gray-800' : 'glass-panel text-white'} rounded-tl-none`
                  }`}
                >
                  <div className="space-y-1">
                    {renderMessageContent(message.text)}
                    
                    {message.images && message.images.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {message.images.map((imgUrl, i) => (
                          <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shadow-md group">
                            <img 
                              src={imgUrl} 
                              alt={`media-${i}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {!isUser && (
                      <div className="mt-3.5 pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[9px] font-mono select-none text-gray-500 uppercase tracking-widest">AETHER SYSTEM</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(message.id, message.text)}
                          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-theme-accent hover:brightness-110 bg-theme-accent/5 hover:bg-theme-accent/10 border border-theme-accent/15 hover:border-theme-accent/30 py-1 px-2.5 rounded-md transition-all cursor-pointer select-none active:scale-95"
                          title="Copy reply contents"
                        >
                          {copiedMessageId === message.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">COPIED!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-theme-accent" />
                              <span>COPY RESPONSE</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden shrink-0 bg-[#282a2e]">
                    <img 
                      src={settings.userAvatar} 
                      alt="user-chat-avatar" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          /* Landing/Empty State Greeting */
          <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-700">
            <div className="w-16 h-16 rounded-2xl bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-theme-accent animate-ai-pulse animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Greetings. I am Aether AI.</h3>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">
              How can I assist you with your creative, analytical, or technical projects today?
            </p>
            
            {/* Suggestion Chips */}
            <div className="flex flex-wrap gap-2.5 justify-center max-w-xl">
              {PRESET_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => selectPreset(chip)}
                  className="px-4 py-2.5 rounded-full glass-panel border border-white/10 text-xs font-semibold text-theme-accent hover:bg-theme-accent/10 transition-colors cursor-pointer whitespace-nowrap active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI Processing typing loader */}
        {isLoading && (
          <div className="flex gap-4 items-start justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-theme-accent/10 border border-theme-accent/25 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4 text-theme-accent animate-spin" />
            </div>
            <div className="glass-panel p-5 rounded-2xl rounded-tl-none border border-theme-accent/20 max-w-[85%] flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-theme-accent animate-bounce transition-all duration-300"></div>
              <div className="w-2 h-2 rounded-full bg-theme-accent animate-bounce transition-all duration-300 [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-theme-accent animate-bounce transition-all duration-300 [animation-delay:0.4s]"></div>
              <span className="text-[10px] font-mono text-theme-accent/80 uppercase tracking-widest leading-none ml-2">Aether is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Interactive Footer Input Area */}
      <div className="pt-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
        
        {/* Attachment Selected indicators */}
        {attachedImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 px-1 items-center animate-in slide-in-from-bottom-2">
            <span className="text-[10px] font-mono text-theme-accent uppercase tracking-wider block mr-1 font-bold">
              Attached ({attachedImages.length}/10):
            </span>
            {attachedImages.map((imgUrl, idx) => (
              <div 
                key={idx}
                className="relative w-12 h-12 rounded-lg overflow-hidden border border-theme-accent/30 group bg-zinc-950"
              >
                <img 
                  src={imgUrl} 
                  alt="attached-thumb" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
                <button 
                  type="button"
                  onClick={() => setAttachedImages(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setAttachedImages([])}
              className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-mono text-red-400 hover:text-red-350 bg-red-500/10 hover:bg-red-500/18 border border-red-500/25 py-1 px-2.5 rounded-lg transition-all cursor-pointer select-none active:scale-95"
              title="Clear all attached images"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* Core Input Form */}
        <form onSubmit={handleSend} className="relative">
          <div className={`glass-panel rounded-full p-2 flex items-center gap-2 border transition-all duration-300
            ${showAttachmentsMenu ? 'border-theme-accent/40' : 'border-white/12'}`}>
            
            {/* Attachment Switch */}
            <button 
              type="button"
              onClick={() => setShowAttachmentsMenu(!showAttachmentsMenu)}
              className="p-2.5 text-gray-400 hover:text-theme-accent hover:bg-white/5 rounded-full cursor-pointer transition-all"
            >
              <Paperclip className="w-4.5 h-4.5" />
            </button>

            {/* Input field */}
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message Aether AI..."
              disabled={isLoading}
              className="flex-grow bg-transparent border-0 ring-0 focus:ring-0 text-white placeholder:text-gray-500 text-sm px-2 focus:outline-none"
            />

            {/* Submit button */}
            <button 
              type="submit"
              disabled={isLoading || (!inputText.trim() && attachedImages.length === 0)}
              className="bg-theme-accent hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none text-black h-10 w-10 flex items-center justify-center rounded-full transition-all active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.15)] cursor-pointer"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Inline Attachment Dropdown Dialog */}
          {showAttachmentsMenu && (
            <div className="absolute bottom-16 left-2 bg-[#14151a] border border-white/12 rounded-2xl p-4.5 shadow-2xl z-40 w-80 md:w-96 animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-white/5">
                <span className="text-xs font-bold uppercase text-theme-accent tracking-wider font-mono flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  Attach Media / Images ({attachedImages.length}/10)
                </span>
                <button 
                  type="button"
                  onClick={() => setShowAttachmentsMenu(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drag/Drop Image Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 mb-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group bg-white/2
                  ${isDragging 
                    ? 'border-theme-accent bg-theme-accent/5' 
                    : 'border-white/10 hover:border-theme-accent/40 hover:bg-white/4'
                  }`}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  disabled={attachedImages.length >= 10}
                  className="hidden"
                />
                <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-theme-accent transition-colors mb-1.5" />
                <span className="text-xs font-semibold text-gray-200">Drag &amp; drop images here</span>
                <span className="text-[10px] text-gray-500 mt-0.5">or click to browse local files</span>
              </div>

              {/* Preset Stock/Tech Images Preset Grid */}
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider font-mono block mb-2">
                  Sample Stock Media
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {IMAGE_PRESETS.map((preset) => {
                    const isSelected = attachedImages.includes(preset.url);
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => toggleImagePreset(preset.url)}
                        title={preset.name}
                        className={`relative aspect-video rounded-lg overflow-hidden border cursor-pointer transition-all active:scale-95
                          ${isSelected 
                            ? 'border-theme-accent ring-1 ring-theme-accent/30 font-medium' 
                            : 'border-white/5 hover:border-white/20'
                          }`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-theme-accent/20 backdrop-blur-[1px] flex items-center justify-center">
                            <Check className="w-4 h-4 text-theme-accent" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-0.5 px-1 truncate text-[8px] text-gray-300 font-medium">
                          {preset.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Model Active Telemetry Indicator */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-950/80 border border-white/5 px-4.5 py-1 rounded-full text-[10px] font-mono tracking-wide text-theme-accent/90 shadow animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse"></span>
            <span>{modelEngineText}</span>
          </div>
        </form>
      </div>

    </div>
  );
}
