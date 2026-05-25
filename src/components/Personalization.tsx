import React, { useState, useRef } from 'react';
import { 
  Palette, 
  Settings, 
  Brain, 
  User, 
  Sliders, 
  Tv, 
  RefreshCw, 
  Info,
  Check,
  Zap,
  Sparkles,
  Cpu,
  UploadCloud,
  X,
  Link
} from 'lucide-react';
import { AppSettings } from '../types';

const AVATAR_PRESETS = [
  { id: 'p1', name: 'Original Bloom', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
  { id: 'p2', name: 'Sleek Executive', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { id: 'p3', name: 'Creative Designer', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
  { id: 'p4', name: 'Innovator Profile', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop' },
  { id: 'p5', name: 'Product Architect', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop' },
  { id: 'p6', name: 'Tech Lead', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
];

interface PersonalizationProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onSave: () => void;
  onReset: () => void;
}

export default function Personalization({
  settings,
  setSettings,
  onSave,
  onReset
}: PersonalizationProps) {

  // Visual feedback states
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Profile image selector & uploader states
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSettings(prev => ({ ...prev, userAvatar: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleLoadUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setSettings(prev => ({ ...prev, userAvatar: customUrl.trim() }));
      setCustomUrl('');
    }
  };

  const handleModelChange = (model: 'ultra' | 'flash') => {
    setSettings(prev => ({ ...prev, selectedModel: model }));
  };

  const handleIntensityChange = (val: number) => {
    setSettings(prev => ({ ...prev, glassIntensity: val }));
    // Live update the CSS variable for immediate feedback
    document.documentElement.style.setProperty('--glass-opacity', (val / 1000).toString());
  };

  const handleThemeChange = (theme: 'midnight' | 'aurora' | 'emerald' | 'cyberpunk' | 'light') => {
    setSettings(prev => ({ ...prev, theme }));
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    // Update data-theme immediately for live preview
    document.documentElement.setAttribute('data-theme', theme);
  };

  const executeSave = () => {
    onSave();
    setSaveStatus('Changes saved successfully!');
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  return (
    <div className="w-full">
      {/* Title */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Personalization</h1>
        <p className="text-gray-400 text-lg">Refine your Aether experience with granular workspace controls.</p>
      </header>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Category: Account Profile */}
        <section className={`md:col-span-12 glass-panel p-6 md:p-8 rounded-2xl border transition-all duration-300
          ${settings.neonGlow ? 'neon-glow-active' : ''}`}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <div 
                  onClick={() => setShowPhotoSelector(!showPhotoSelector)}
                  className="relative group cursor-pointer"
                  title="Change profile photo"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-400/40 bg-zinc-800 flex items-center justify-center relative shadow-lg smooth-hover">
                    <img 
                      src={settings.userAvatar} 
                      alt="user-profile" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 smooth-hover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Change</span>
                    </div>
                  </div>
                  {/* Edit overlay icon */}
                  <div 
                    className="absolute bottom-0 right-0 bg-cyan-400 text-black p-1.5 rounded-full border-2 border-zinc-950 hover:bg-cyan-300 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={settings.username}
                      onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
                      className="text-2xl font-bold tracking-tight text-white bg-transparent border-b border-transparent hover:border-white/10 focus:border-cyan-400/50 focus:outline-none transition-all duration-200 py-0.5"
                      placeholder="Username"
                      title="Click to edit username"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-400 mt-1">Pro Plan • Member since 2024</p>
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setShowPhotoSelector(!showPhotoSelector)}
                  className="flex-1 md:flex-none bg-white/5 text-gray-200 border border-white/10 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {showPhotoSelector ? 'Hide Editor' : 'Change Photo'}
                </button>
                <button 
                  onClick={() => alert("Disconnecting secure active workspace. Redirecting back...")}
                  className="flex-1 md:flex-none bg-cyan-400 text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-cyan-300 transition-colors cursor-pointer active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Change Profile Photo Drawer Panel */}
            {showPhotoSelector && (
              <div className="pt-6 mt-4 border-t border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                {/* Presets Column */}
                <div className="lg:col-span-7">
                  <p className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-cyan-400" />
                    Select Predefined Presets
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, userAvatar: preset.url }))}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all active:scale-95
                          ${settings.userAvatar === preset.url 
                            ? 'border-cyan-400 bg-cyan-400/5 scale-102 shadow-[0_0_15px_rgba(0,240,255,0.25)]' 
                            : 'border-white/5 hover:border-white/25 bg-zinc-900/50'
                          }`}
                        title={preset.name}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        {settings.userAvatar === preset.url && (
                          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                            <Check className="w-5 h-5 text-cyan-400" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload & Link Column */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-cyan-400" />
                      Upload Custom Photo
                    </p>
                    
                    {/* File Upload Area */}
                    <div
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group
                        ${isDragging 
                          ? 'border-cyan-400 bg-cyan-400/5' 
                          : 'border-white/10 hover:border-white/30 bg-white/2 hover:bg-white/5'
                        }`}
                    >
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <UploadCloud className="w-7 h-7 text-gray-400 group-hover:text-cyan-400 transition-colors mb-2" />
                      <span className="text-xs font-semibold text-gray-200">Drag &amp; drop profile image</span>
                      <span className="text-[10px] text-gray-500 mt-1">or click to select file</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Link className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs text-gray-400 font-semibold">Or paste direct image URL</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-grow bg-zinc-950 text-white text-xs border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400/40 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleLoadUrl}
                        className="bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200 text-xs px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Category: Model Selection */}
        <section className="md:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-bold tracking-tight text-white">Model Selection</h3>
            </div>
            
            <div className="space-y-4 flex-grow">
              {/* Model Card Active (Ultra) */}
              <div 
                onClick={() => handleModelChange('ultra')}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer smooth-hover
                  ${settings.selectedModel === 'ultra'
                    ? 'bg-theme-accent/10 border-theme-accent/40 text-white'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/15'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <Zap className={`w-5 h-5 ${settings.selectedModel === 'ultra' ? 'text-theme-accent' : 'text-gray-400'}`} />
                  <div>
                    <p className={`font-bold transition-colors ${settings.selectedModel === 'ultra' ? 'text-white' : 'text-gray-200'}`}>
                      Aether 1.5 Pro
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Optimal for complex reasoning &amp; creative coding</p>
                  </div>
                </div>
                {settings.selectedModel === 'ultra' ? (
                  <div className="w-5 h-5 rounded-full border-4 border-theme-accent bg-zinc-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-theme-accent" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/20"></div>
                )}
              </div>

              {/* Model Card Inactive (Flash) */}
              <div 
                onClick={() => handleModelChange('flash')}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer smooth-hover
                  ${settings.selectedModel === 'flash'
                    ? 'bg-theme-accent/10 border-theme-accent/40 text-white'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/15'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <Sparkles className={`w-5 h-5 ${settings.selectedModel === 'flash' ? 'text-theme-accent' : 'text-gray-400'}`} />
                  <div>
                    <p className={`font-bold transition-colors ${settings.selectedModel === 'flash' ? 'text-white' : 'text-gray-200'}`}>
                      Aether 1.5 Flash
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Lightning fast, ideal for quick summaries</p>
                  </div>
                </div>
                {settings.selectedModel === 'flash' ? (
                  <div className="w-5 h-5 rounded-full border-4 border-theme-accent bg-zinc-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-theme-accent" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/20"></div>
                )}
              </div>
            </div>
          </div>
          
          {/* Category: System Memory */}
          <div className="glass-panel p-6 rounded-2xl border">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-bold tracking-tight text-white">System Memory</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Allow the AI to retain context across disparate sessions for more personalized results.
            </p>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <span className="text-gray-200 font-medium text-sm">Cross-Session Context</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.crossSessionContext}
                  onChange={(e) => setSettings(prev => ({ ...prev, crossSessionContext: e.target.checked }))}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-400"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Category: Appearance & Aesthetics */}
        <section className="md:col-span-5">
          <div className="glass-panel p-6 rounded-2xl border h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-theme-accent" />
                <h3 className="text-xl font-bold tracking-tight text-white">Appearance</h3>
              </div>
              
              <div className="space-y-6">
                {/* Intensity Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-200">Glass Intensity</label>
                    <span className="text-xs font-mono font-semibold text-theme-accent bg-theme-accent/10 px-2 py-0.5 rounded">
                      {Math.round(settings.glassIntensity)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="10" 
                      max="150" 
                      value={settings.glassIntensity}
                      onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-theme-accent" 
                    />
                  </div>
                </div>

                {/* Switch Neon Glow */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-theme-accent animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-gray-200">Neon Glow</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Atmospheric accent lighting</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.neonGlow}
                      onChange={(e) => setSettings(prev => ({ ...prev, neonGlow: e.target.checked }))}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme-accent"></div>
                  </label>
                </div>

                {/* Interface Theme buttons */}
                <div className="pt-4 border-t border-white/5">
                  <p className="text-sm font-semibold text-gray-200 mb-3">Interface Theme</p>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {/* Midnight Theme */}
                    <div 
                      onClick={() => handleThemeChange('midnight')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer smooth-hover
                        ${settings.theme === 'midnight'
                          ? 'bg-purple-500/5 border-purple-500/40 text-purple-400'
                          : 'bg-zinc-950 border-white/5 text-gray-400 opacity-60 hover:opacity-100'
                        }`}
                    >
                      <div className="w-full h-8 bg-[#09080d] rounded border border-white/5 p-1.5 flex flex-col gap-1">
                        <div className="w-1/2 h-1 bg-purple-500 rounded"></div>
                        <div className="w-full h-1 bg-white/10 rounded"></div>
                      </div>
                      <span className="text-[11px] font-semibold">Midnight Violet</span>
                    </div>

                    {/* Aurora Theme */}
                    <div 
                      onClick={() => handleThemeChange('aurora')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer smooth-hover
                        ${settings.theme === 'aurora'
                          ? 'bg-cyan-500/5 border-cyan-500/40 text-cyan-400'
                          : 'bg-zinc-950 border-white/5 text-gray-400 opacity-60 hover:opacity-100'
                        }`}
                    >
                      <div className="w-full h-8 bg-[#030a0d] rounded border border-white/5 p-1.5 flex flex-col gap-1">
                        <div className="w-1/2 h-1 bg-cyan-400 rounded"></div>
                        <div className="w-full h-1 bg-teal-500/30 rounded"></div>
                      </div>
                      <span className="text-[11px] font-semibold">Aqua Polaris</span>
                    </div>

                    {/* Emerald Theme */}
                    <div 
                      onClick={() => handleThemeChange('emerald')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer smooth-hover
                        ${settings.theme === 'emerald'
                          ? 'bg-emerald-400/5 border-emerald-400/40 text-emerald-400'
                          : 'bg-zinc-950 border-white/5 text-gray-400 opacity-60 hover:opacity-100'
                        }`}
                    >
                      <div className="w-full h-8 bg-[#020503] rounded border border-white/5 p-1.5 flex flex-col gap-1">
                        <div className="w-1/2 h-1 bg-emerald-400 rounded"></div>
                        <div className="w-full h-1 bg-green-500/20 rounded"></div>
                      </div>
                      <span className="text-[11px] font-semibold">Emerald Moss</span>
                    </div>

                    {/* Cyberpunk Theme */}
                    <div 
                      onClick={() => handleThemeChange('cyberpunk')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer smooth-hover
                        ${settings.theme === 'cyberpunk'
                          ? 'bg-pink-400/5 border-pink-400/40 text-pink-400'
                          : 'bg-zinc-950 border-white/5 text-gray-400 opacity-60 hover:opacity-100'
                        }`}
                    >
                      <div className="w-full h-8 bg-[#12031a] rounded border border-white/5 p-1.5 flex flex-col gap-1">
                        <div className="w-1/2 h-1 bg-pink-500 rounded"></div>
                        <div className="w-full h-1 bg-purple-500/20 rounded"></div>
                      </div>
                      <span className="text-[11px] font-semibold">Tokyo Sunset</span>
                    </div>

                    {/* Light Theme */}
                    <div 
                      onClick={() => handleThemeChange('light')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer smooth-hover
                        ${settings.theme === 'light'
                          ? 'bg-blue-400/5 border-blue-400/40 text-blue-500 font-semibold'
                          : 'bg-zinc-950 border-white/5 text-gray-400 opacity-60 hover:opacity-100'
                        }`}
                    >
                      <div className="w-full h-8 bg-[#f4f4f5] rounded border border-black/5 p-1.5 flex flex-col gap-1">
                        <div className="w-1/2 h-1 bg-blue-500 rounded"></div>
                        <div className="w-full h-1 bg-black/10 rounded"></div>
                      </div>
                      <span className="text-[11px] font-semibold">Sapphire Light</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Engine parameters log */}
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5 flex gap-3">
              <Info className="w-4 h-4 text-theme-accent shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-theme-accent font-mono">
                  Visual Engine Active
                </span>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
                  The Aether interface utilizes real-time Gaussian blurs and HDR color spacing to ensure maximum readability on OLED displays.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Save action items */}
        <section className="md:col-span-12 flex flex-col md:flex-row justify-between items-center gap-4 mt-4 pt-6 border-t border-white/5">
          <div>
            {saveStatus && (
              <span className="text-xs font-semibold text-emerald-400 tracking-wide animate-pulse">
                {saveStatus}
              </span>
            )}
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={onReset}
              className="w-full md:w-auto text-gray-400 hover:text-white font-semibold text-sm px-6 py-2.5 rounded-full border border-transparent hover:bg-white/5 transition-all cursor-pointer"
            >
              Reset to Defaults
            </button>
            <button 
              onClick={executeSave}
              className="w-full md:w-auto bg-theme-accent hover:brightness-110 text-black font-bold px-10 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </section>
        
      </div>
    </div>
  );
}
