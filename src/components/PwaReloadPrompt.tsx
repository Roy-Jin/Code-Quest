import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../config';
import { usePwaUpdate } from '../hooks/usePwaUpdate';

export function PwaReloadPrompt() {
  const { settings } = useStore();
  const t = TRANSLATIONS[settings.language];
  const { showReloadPrompt, close, reload } = usePwaUpdate();

  return (
    <AnimatePresence>
      {showReloadPrompt && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={close}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 p-6 pb-8">
                {/* Close button */}
                <button
                  onClick={close}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label={t.cancel}
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Icon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4"
                >
                  <RefreshCw className="w-8 h-8 text-white" />
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-2">
                  {t.newVersionAvailable}
                </h2>
                <p className="text-amber-100 text-sm">
                  {t.newVersionDesc}
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Features list */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3 text-slate-300">
                    <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      {settings.language === 'zh' 
                        ? '新功能和性能改进' 
                        : 'New features and performance improvements'}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-slate-300">
                    <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      {settings.language === 'zh' 
                        ? '错误修复和稳定性提升' 
                        : 'Bug fixes and stability enhancements'}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={reload}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
                  >
                    {t.refreshNow}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={close}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-semibold border border-slate-700 hover:border-slate-600 transition-all"
                  >
                    {t.later}
                  </motion.button>
                </div>

                {/* Info text */}
                <p className="text-xs text-slate-500 text-center pt-2">
                  {settings.language === 'zh' 
                    ? '更新只需几秒钟，不会丢失任何数据' 
                    : 'Update takes just a few seconds and won\'t lose any data'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}