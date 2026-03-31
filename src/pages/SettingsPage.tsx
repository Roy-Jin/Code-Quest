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
  X,
  Target,
  Download
} from 'lucide-react';
import { TooltipButton } from '../components/TooltipButton';
import { BackgroundGrid } from '../components/BackgroundGrid';
import { PageTransition } from '../components/PageTransition';
import { TRANSLATIONS, LANGUAGE_NAMES } from '../config';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useStore } from '../context/StoreContext';
import { CustomSelect } from '../components/CustomSelect';
import { usePwaUpdate } from '../hooks/usePwaUpdate';

export function SettingsPage() {
  const navigate = useNavigate();
  const { settings, updateSettings, resetSettings, resetProgress, resetAll } = useStore();
  const { updatePending, needRefresh, checkForUpdate } = usePwaUpdate();
  
  const t = TRANSLATIONS[settings.language];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateCheckMessage, setUpdateCheckMessage] = useState('');
  const [updateCheckStatus, setUpdateCheckStatus] = useState<'idle' | 'checking' | 'found' | 'not-found'>('idle');

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

  const handleCheckForUpdates = async () => {
    setIsCheckingUpdate(true);
    setUpdateCheckMessage('');
    setUpdateCheckStatus('checking');
    
    try {
      const hasUpdate = await checkForUpdate();
      
      setTimeout(() => {
        setIsCheckingUpdate(false);
        if (hasUpdate || needRefresh) {
          setUpdateCheckStatus('found');
          setUpdateCheckMessage(settings.language === 'zh' ? '更新已下载！刷新页面即可应用' : 'Update downloaded! Refresh to apply');
        } else {
          setUpdateCheckStatus('not-found');
          setUpdateCheckMessage(t.noUpdatesAvailable || 'You are using the latest version.');
        }
      }, 1000);
    } catch (error) {
      setIsCheckingUpdate(false);
      setUpdateCheckStatus('not-found');
      setUpdateCheckMessage(t.noUpdatesAvailable || 'You are using the latest version.');
    }
  };

  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                (window.navigator as any).standalone === true;

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
    { id: 'game', label: t.game, icon: Target },
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
    <PageTransition className="h-screen w-full bg-slate-950 text-slate-200 font-sans flex flex-col relative overflow-hidden">
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
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-20 shrink-0 flex items-center px-4 lg:px-8 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/5 relative"
      >
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <TooltipButton
                icon={<ArrowLeft size={24} />}
                tooltip={t.back}
                onClick={() => navigate(-1)}
                className="p-3 bg-slate-900/30 hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400 rounded-full border border-white/10 hover:border-cyan-500/50 transition-all backdrop-blur-md shadow-lg"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 tracking-tight"
            >
              {t.settings}
            </motion.h1>
          </div>
          
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* Desktop Sidebar Navigation (Sticky) */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="hidden lg:block w-64 shrink-0 space-y-2 sticky top-0 h-fit"
        >
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                whileHover={{ x: 4 }}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 font-medium text-sm border ${
                  isActive 
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:border-white/10'
                } backdrop-blur-md`}
              >
                <Icon size={18} />
                {section.label}
              </motion.button>
            );
          })}
        </motion.nav>

        {/* Content Area (Scrollable) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          ref={contentRef}
          className="flex-1 min-w-0 h-full overflow-y-auto pb-20 px-1"
        >
          <div className="space-y-8 pb-20">
            {/* General Settings */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              id="general"
              ref={(el) => sectionsRef.current.general = el}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Monitor size={24} className="text-blue-400" />
                {t.general}
              </h2>
              
              {/* Language Settings */}
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

              {/* PWA Update Check - Only show in PWA mode */}
              {isPWA && (
                <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                  <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <Download size={20} className="text-blue-400" />
                    {t.checkForUpdates}
                  </h2>
                  <div className="space-y-3">
                    {updatePending && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <p className="text-sm text-amber-400">
                          {t.updateOnRestart || 'Update ready! Refresh the page to apply the latest version.'}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleCheckForUpdates}
                      disabled={isCheckingUpdate}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                    >
                      <RefreshCw size={18} className={isCheckingUpdate ? 'animate-spin' : ''} />
                      {isCheckingUpdate ? (t.checkingForUpdates || 'Checking...') : (t.checkForUpdates || 'Check for Updates')}
                    </button>
                    {updateCheckMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg ${
                          updateCheckStatus === 'found' 
                            ? 'bg-amber-500/10 border border-amber-500/20' 
                            : 'bg-green-500/10 border border-green-500/20'
                        }`}
                      >
                        <p className={`text-sm text-center ${
                          updateCheckStatus === 'found' ? 'text-amber-400' : 'text-green-400'
                        }`}>
                          {updateCheckMessage}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </motion.section>

            {/* Game Settings */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              id="game"
              ref={(el) => sectionsRef.current.game = el}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Target size={24} className="text-cyan-400" />
                {t.game}
              </h2>
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Target size={20} className="text-cyan-400" />
                  {t.behavior}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{t.autoShowObjectives}</span>
                      <span className="text-xs text-slate-500">{t.autoShowObjectivesDesc}</span>
                    </div>
                    <button
                      onClick={() => updateSettings({ autoShowObjectives: !settings.autoShowObjectives })}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                        settings.autoShowObjectives ? 'bg-cyan-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.autoShowObjectives ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{t.showTooltips}</span>
                      <span className="text-xs text-slate-500">{t.showTooltipsDesc}</span>
                    </div>
                    <button
                      onClick={() => updateSettings({ showTooltips: !settings.showTooltips })}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                        settings.showTooltips ? 'bg-cyan-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.showTooltips ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-slate-200">{t.defaultRobotSpeed}</label>
                        <span className="text-xs text-slate-500">{t.defaultRobotSpeedDesc}</span>
                      </div>
                      <span className="text-sm text-cyan-400 font-mono">{settings.defaultRobotSpeed}ms</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="500"
                      step="10"
                      value={settings.defaultRobotSpeed}
                      onChange={(e) => updateSettings({ defaultRobotSpeed: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>{t.fast} (100ms)</span>
                      <span>{t.medium} (300ms)</span>
                      <span>{t.slow} (500ms)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Editor Settings */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
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
            </motion.section>

            {/* Audio Settings */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
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
                  {/* Background Music */}
                  <div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5 mb-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-200">{t.musicEnabled}</span>
                        <span className="text-xs text-slate-500">{t.musicEnabledDesc}</span>
                      </div>
                      <button
                        onClick={() => updateSettings({ musicEnabled: !settings.musicEnabled })}
                        className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                          settings.musicEnabled ? 'bg-pink-600' : 'bg-slate-700'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                    
                    <div className={`transition-opacity duration-300 ${settings.musicEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
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
                        disabled={!settings.musicEnabled}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Sound Effects */}
                  <div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5 mb-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-200">{t.sfxEnabled}</span>
                        <span className="text-xs text-slate-500">{t.sfxEnabledDesc}</span>
                      </div>
                      <button
                        onClick={() => updateSettings({ sfxEnabled: !settings.sfxEnabled })}
                        className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                          settings.sfxEnabled ? 'bg-pink-600' : 'bg-slate-700'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          settings.sfxEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                    
                    <div className={`transition-opacity duration-300 ${settings.sfxEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
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
                        disabled={!settings.sfxEnabled}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Data Settings */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
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
            </motion.section>
          </div>
        </motion.div>
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
    </PageTransition>
  );
}
