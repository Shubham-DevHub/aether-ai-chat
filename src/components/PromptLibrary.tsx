import React, { useState } from 'react';
import { 
  Search, 
  Terminal, 
  TrendingUp, 
  PenTool, 
  Database, 
  BarChart3, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PromptTemplate, AppSettings } from '../types';

interface PromptLibraryProps {
  onSelectTemplate: (template: PromptTemplate) => void;
  settings: AppSettings;
}

const TEMPLATE_DATA: PromptTemplate[] = [
  {
    id: 'debug-engine',
    title: 'Advanced Debugging Engine',
    description: 'Deconstruct complex stack traces, identify memory leaks, and receive refactoring suggestions for Python, Rust, and TypeScript ecosystems.',
    category: 'Coding',
    isFeatured: true,
    icon: 'terminal',
    version: 'FEATURED',
    tags: ['Ecosystems', 'Diagnostics'],
    usedCount: '12k+ engineers',
    promptText: 'Analyze the following backend stack trace, identify potential memory leaks or race conditions, and recommend an optimized TypeScript or Rust event loop structures.'
  },
  {
    id: 'sentiment-analysis',
    title: 'Market Sentiment Analysis',
    description: 'Extract nuanced market signals from social data and financial reports using deep linguistic analysis.',
    category: 'Analysis',
    icon: 'trending-up',
    version: 'ANALYSIS',
    tags: ['Linguistic', 'Market Stats'],
    promptText: 'Provide a structured Market Sentiment Analysis report using social sentiment vectors and deep linguistic profiling to isolate market trends.'
  },
  {
    id: 'narrative-architect',
    title: 'Creative Narrative Architect',
    description: 'Build complex world-building bibles and character arcs with consistent lore tracking.',
    category: 'Writing',
    icon: 'pen-tool',
    tags: ['FICTION', 'WORLDBUILDING'],
    promptText: 'Draft a complex worldbuilding bible centering subterranean civilizations, mapping out key factions, resources, technological thresholds, and cultural conflicts.'
  },
  {
    id: 'api-schema',
    title: 'API Schema Generator',
    description: 'Generate robust OpenAPI specifications and client libraries from natural language descriptions.',
    category: 'Coding',
    icon: 'database',
    version: 'LATEST VERSION',
    tags: ['OpenAPI', 'Schemas'],
    promptText: 'Create a fully compliant OpenAPI 3.1 schema specification for a full-stack e-commerce Microservice platform handling items, carts, and Stripe payments.'
  },
  {
    id: 'data-viz',
    title: 'Data Visualization Strategist',
    description: 'Transforms raw JSON or CSV datasets into optimized D3.js or Mermaid diagram structures.',
    category: 'Analysis',
    icon: 'bar-chart',
    tags: ['D3.js', 'Mermaid'],
    promptText: 'Translate this raw dataset into a rich, interactive D3.js data array and accompany with a beautiful Mermaid node flowchart map detailing node dependencies.'
  }
];

export default function PromptLibrary({ onSelectTemplate, settings }: PromptLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState<'all' | 'coding' | 'writing' | 'analysis'>('all');

  const filtered = TEMPLATE_DATA.filter(t => {
    // Search query check
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Filter chip check
    if (activeChip === 'all') return true;
    return t.category.toLowerCase() === activeChip;
  });

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case 'terminal':
        return <Terminal className="w-6 h-6 text-[#00f0ff]" />;
      case 'trending-up':
        return <TrendingUp className="w-6 h-6 text-[#fed639]" />;
      case 'pen-tool':
        return <PenTool className="w-6 h-6 text-[#adc6ff]" />;
      case 'database':
        return <Database className="w-6 h-6 text-[#00f0ff]" />;
      case 'bar-chart':
        return <BarChart3 className="w-6 h-6 text-[#fed639]" />;
      default:
        return <Sparkles className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="w-full">
      {/* Title & Banner Header Section */}
      <section className="mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight mb-3">Prompt Library</h2>
        <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
          Accelerate your workflow with precision-engineered templates. Explore our curated collection of prompts designed for professional grade output.
        </p>
      </section>

      {/* Search and Filters Segment */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 w-full">
        {/* Search Bar */}
        <div className="flex-grow relative group">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-theme-accent transition-colors pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-white placeholder:text-gray-500 hover:bg-white/10 focus:outline-none focus:border-theme-accent/50 focus:ring-2 focus:ring-theme-accent/10 transition-all text-sm smooth-hover"
          />
        </div>

        {/* Filter Chip buttons */}
        <div className="flex gap-2 items-center overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          {(['all', 'coding', 'writing', 'analysis'] as const).map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              className={`px-6 py-3 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 border cursor-pointer
                ${activeChip === chip 
                  ? 'bg-theme-accent border-theme-accent text-black hover:brightness-110' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              {chip === 'all' ? 'All Templates' : chip.charAt(0).toUpperCase() + chip.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid array */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {filtered.map((templ) => {
          // Check if this is a large featured card (e.g., debug-engine)
          if (templ.isFeatured) {
            return (
              <div 
                key={templ.id}
                onClick={() => onSelectTemplate(templ)}
                className="col-span-12 md:col-span-12 lg:col-span-8 group cursor-pointer"
              >
                <div 
                  className={`glass-panel rounded-2xl p-8 h-full transition-all duration-500 relative overflow-hidden flex flex-col justify-end min-h-[380px] hover:-translate-y-1.5 hover:border-cyan-400/40
                    ${settings.neonGlow ? 'neon-glow-active' : ''}`}
                >
                  {/* Absolute backdrop glow decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-[90px] -mr-32 -mt-32 rounded-full pointer-events-none"></div>
                  
                  <div className="mb-auto">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-400/15 text-cyan-400 text-[10px] font-bold tracking-wider mb-6 border border-cyan-400/20 uppercase">
                      {templ.version}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:border-[#00f0ff]/30 smooth-hover">
                      {getIconComponent(templ.icon)}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-cyan-400 transition-colors">
                      {templ.title}
                    </h3>
                    <p className="text-gray-400 max-w-md text-sm leading-relaxed">
                      {templ.description}
                    </p>
                  </div>

                  {/* Customer stats / footer */}
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                    <div className="flex -space-x-1.5">
                      {/* Avatar Mock 1 */}
                      <div className="w-7 h-7 rounded-full border border-[#111318] bg-gray-700 overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop" 
                          alt="engineer-avatar-1" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      {/* Avatar Mock 2 */}
                      <div className="w-7 h-7 rounded-full border border-[#111318] bg-gray-700 overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop" 
                          alt="engineer-avatar-2" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      Used by {templ.usedCount}
                    </span>
                  </div>
                </div>
              </div>
            );
          } else {
            // Normal Bento Card
            return (
              <div 
                key={templ.id}
                onClick={() => onSelectTemplate(templ)}
                className="col-span-12 md:col-span-6 lg:col-span-4 group cursor-pointer"
              >
                <div 
                  className={`glass-panel rounded-2xl p-7 h-full transition-all duration-500 flex flex-col hover:-translate-y-1.5 hover:border-cyan-400/40
                    ${settings.neonGlow ? 'neon-glow-active' : ''}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 smooth-hover">
                      {getIconComponent(templ.icon)}
                    </div>
                    {templ.version && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#fed639]/10 text-[#fed639] text-[9px] font-bold tracking-wider border border-[#fed639]/20">
                        {templ.version}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-cyan-400 transition-colors">
                    {templ.title}
                  </h3>
                  
                  <p className="text-gray-400 text-xs leading-relaxed flex-grow">
                    {templ.description}
                  </p>

                  {/* Display tags / actions depending on the card properties */}
                  {templ.tags && templ.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-6 pt-5 border-t border-white/5">
                      {templ.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-0.5 bg-white/5 rounded text-[9px] text-gray-400 uppercase font-bold border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {!templ.tags && (
                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        {templ.category}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1.5 transition-all smooth-hover" />
                    </div>
                  )}

                  {templ.id === 'data-viz' && (
                    <div className="mt-4">
                      <button className="text-xs text-cyan-400 font-bold hover:underline py-1 w-full text-left cursor-pointer">
                        Preview Output
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }
        })}

        {filtered.length === 0 && (
          <div className="col-span-12 py-16 text-center text-gray-400">
            <p className="text-lg font-medium">No templates matching your query.</p>
            <p className="text-sm text-gray-500 mt-1">Try resetting your search parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
