import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Monitor, 
  Volume2, 
  Code, 
  Database, 
  Check, 
  Type, 
  Trash2,
  RefreshCw,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { TooltipButton } from '../components/TooltipButton';
import { BackgroundGrid } from '../components/BackgroundGrid';
import { TRANSLATIONS, LANGUAGE_NAMES } from '../config';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useStore } from '../context/StoreContext';
import { CustomSelect } from '../components/CustomSelect';

export function SettingsPage() {
  const navigate = useNavigate();
  const { settings, updateSettings, resetSettings, resetProgress, resetAll } = useStore();
  
  const t = TRANSLATIONS[settings.language];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'info' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info',
  });

  const handleSetLang = (newLang: 'en' | 'zh') => {
    updateSettings({ language: newLang });
  };

  const handleResetProgress = () => {
    setConfirmDialog({
      isOpen: true,
      title: t.resetProgress,
      message: t.resetProgressConfirm || 'Are you sure you want to reset all game progress? This action cannot be undone.',
      type: 'danger',
      onConfirm: () => {
        resetProgress();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleResetSettings = () => {
    setConfirmDialog({
      isOpen: true,
      title: t.restoreDefaults,
      message: t.restoreDefaultsConfirm || 'Are you sure you want to restore default settings?',
      type: 'warning',
      onConfirm: () => {
        resetSettings();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const sections = [
    { id: 'general', label: t.general, icon: Monitor },
    { id: 'editor', label: t.editor, icon: Code },
    { id: 'audio', label: t.audio, icon: Volume2 },
    { id: 'data', label: t.data, icon: Database },
  ];

  const scrollToSection = (id: string) => {
    const section = sectionsRef.current[id];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const container = contentRef.current;
      const containerRect = container.getBoundingClientRect();
      
      for (const section of sections) {
        const el = sectionsRef.current[section.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= containerRect.top + 100) {
            setActiveSection(section.id);
          }
        }
      }
    };

    const container = contentRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 font-sans flex flex-col relative overflow-hidden">
      <BackgroundGrid />

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-slate-900 border-l border-white/10 z-70 p-6 lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-200">{t.settings}</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 font-medium text-sm border ${
                        isActive 
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                          : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <Icon size={18} />
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-20 shrink-0 flex items-center px-4 lg:px-8 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/5 relative">
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <TooltipButton
              icon={<ArrowLeft size={24} />}
              tooltip={t.back}
              onClick={() => navigate(-1)}
              className="p-3 bg-slate-900/30 hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400 rounded-full border border-white/10 hover:border-cyan-500/50 transition-all backdrop-blur-md shadow-lg"
            />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 tracking-tight">
              {t.settings}
            </h1>
          </div>
          
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* Desktop Sidebar Navigation (Sticky) */}
        <nav className="hidden lg:block w-64 shrink-0 space-y-2 sticky top-0 h-fit">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 font-medium text-sm border ${
                  isActive 
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:border-white/10'
                } backdrop-blur-md`}
              >
                <Icon size={18} />
                {section.label}
              </button>
            );
          })}
        </nav>

        {/* Content Area (Scrollable) */}
        <div 
          ref={contentRef}
          className="flex-1 min-w-0 h-full overflow-y-auto pb-20 px-1"
        >
          <div className="space-y-8 pb-20">
            {/* General Settings */}
            <section 
              id="general"
              ref={(el) => sectionsRef.current.general = el}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Monitor size={24} className="text-blue-400" />
                {t.general}
              </h2>
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Globe size={20} className="text-blue-400" />
                  {t.language}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => handleSetLang(code as 'en' | 'zh')}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                        settings.language === code
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                          : 'bg-slate-800/30 border-white/5 text-slate-400 hover:border-white/20 hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="font-medium">{name}</span>
                      </span>
                      {settings.language === code && <Check size={18} />}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Editor Settings */}
            <section 
              id="editor"
              ref={(el) => sectionsRef.current.editor = el}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Code size={24} className="text-emerald-400" />
                {t.editor}
              </h2>
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
                  <Type size={20} className="text-emerald-400" />
                  {t.typography}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-slate-300">{t.fontSize}</label>
                      <span className="text-sm text-emerald-400 font-mono">{settings.fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      step="1"
                      value={settings.fontSize}
                      onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="mt-4 p-4 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-slate-400 shadow-inner overflow-x-auto max-w-full" style={{ fontSize: `${settings.fontSize}px` }}>
                      <span className="text-purple-400">function</span> <span className="text-blue-400">hello</span>() {'{'}
                      <br />
                      &nbsp;&nbsp;<span className="text-slate-300">console</span>.<span className="text-yellow-400">log</span>(<span className="text-green-400">"Hello World!"</span>);
                      <br />
                      {'}'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Code size={20} className="text-cyan-400" />
                  {t.behavior}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{t.minimap}</span>
                      <span className="text-xs text-slate-500">{t.minimapDesc}</span>
                    </div>
                    <button
                      onClick={() => updateSettings({ minimap: !settings.minimap })}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                        settings.minimap ? 'bg-cyan-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.minimap ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{t.wordWrap}</span>
                      <span className="text-xs text-slate-500">{t.wordWrapDesc}</span>
                    </div>
                    <button
                      onClick={() => updateSettings({ wordWrap: !settings.wordWrap })}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                        settings.wordWrap ? 'bg-cyan-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.wordWrap ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{t.lineNumbers}</span>
                      <span className="text-xs text-slate-500">{t.lineNumbersDesc}</span>
                    </div>
                    <button
                      onClick={() => updateSettings({ lineNumbers: !settings.lineNumbers })}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                        settings.lineNumbers ? 'bg-cyan-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.lineNumbers ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{t.folding}</span>
                      <span className="text-xs text-slate-500">{t.foldingDesc}</span>
                    </div>
                    <button
                      onClick={() => updateSettings({ folding: !settings.folding })}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                        settings.folding ? 'bg-cyan-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.folding ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{t.bracketPairColorization}</span>
                      <span className="text-xs text-slate-500">{t.bracketPairColorizationDesc}</span>
                    </div>
                    <button
                      onClick={() => updateSettings({ bracketPairColorization: !settings.bracketPairColorization })}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                        settings.bracketPairColorization ? 'bg-cyan-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.bracketPairColorization ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{t.formatOnType}</span>
                      <span className="text-xs text-slate-500">{t.formatOnTypeDesc}</span>
                    </div>
                    <button
                      onClick={() => updateSettings({ formatOnType: !settings.formatOnType })}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                        settings.formatOnType ? 'bg-cyan-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.formatOnType ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Monitor size={20} className="text-purple-400" />
                  {t.cursorStyle} & {t.tabSize}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{t.cursorBlinking}</span>
                      <span className="text-xs text-slate-500">{t.cursorBlinkingDesc}</span>
                    </div>
                    <div className="relative w-48">
                      <CustomSelect
                        value={settings.cursorBlinking}
                        onChange={(value) => updateSettings({ cursorBlinking: value })}
                        options={[
                          { value: 'blink', label: t.blink || 'Blink' },
                          { value: 'smooth', label: t.smooth || 'Smooth' },
                          { value: 'phase', label: t.phase || 'Phase' },
                          { value: 'expand', label: t.expand || 'Expand' },
                          { value: 'solid', label: t.solid || 'Solid' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{t.cursorStyle}</span>
                      <span className="text-xs text-slate-500">{t.cursorStyleDesc}</span>
                    </div>
                    <div className="relative w-48">
                      <CustomSelect
                        value={settings.cursorStyle}
                        onChange={(value) => updateSettings({ cursorStyle: value })}
                        options={[
                          { value: 'line', label: t.line || 'Line' },
                          { value: 'block', label: t.block || 'Block' },
                          { value: 'underline', label: t.underline || 'Underline' },
                          { value: 'line-thin', label: t.lineThin || 'Line Thin' },
                          { value: 'block-outline', label: t.blockOutline || 'Block Outline' },
                          { value: 'underline-thin', label: t.underlineThin || 'Underline Thin' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{t.tabSize}</span>
                      <span className="text-xs text-slate-500">{t.tabSizeDesc}</span>
                    </div>
                    <div className="relative w-48">
                      <CustomSelect
                        value={settings.tabSize}
                        onChange={(value) => updateSettings({ tabSize: value })}
                        options={[
                          { value: 2, label: '2 Spaces' },
                          { value: 4, label: '4 Spaces' },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Audio Settings */}
            <section 
              id="audio"
              ref={(el) => sectionsRef.current.audio = el}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Volume2 size={24} className="text-pink-400" />
                {t.audio}
              </h2>
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
                  <Volume2 size={20} className="text-pink-400" />
                  {t.volumeControl}
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        {t.music}
                      </label>
                      <span className="text-sm text-pink-400 font-mono">{settings.musicVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.musicVolume}
                      onChange={(e) => updateSettings({ musicVolume: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        {t.soundEffects}
                      </label>
                      <span className="text-sm text-pink-400 font-mono">{settings.sfxVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.sfxVolume}
                      onChange={(e) => updateSettings({ sfxVolume: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Data Settings */}
            <section 
              id="data"
              ref={(el) => sectionsRef.current.data = el}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Database size={24} className="text-red-400" />
                {t.data}
              </h2>
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Database size={20} className="text-red-400" />
                  {t.gameData}
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                        <Trash2 size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-red-400 mb-1">{t.resetProgress}</h3>
                        <p className="text-sm text-slate-400 mb-4">
                          {t.resetProgressDesc}
                        </p>
                        <button 
                          onClick={handleResetProgress}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-red-900/20"
                        >
                          {t.resetAllData}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <RefreshCw size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-blue-400 mb-1">{t.restoreDefaults}</h3>
                        <p className="text-sm text-slate-400 mb-4">
                          {t.restoreDefaultsDesc}
                        </p>
                        <button 
                          onClick={handleResetSettings}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                        >
                          {t.restoreSettings}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        confirmText={t.confirm || 'Confirm'}
        cancelText={t.cancel || 'Cancel'}
      />
    </div>
  );
}
