import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, X } from 'lucide-react';
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
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative bg-linear-to-r from-amber-600 to-orange-600 p-4">
              <button
                onClick={close}
                className="absolute top-2 right-2 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={t.cancel}
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0"
                >
                  <RefreshCw className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {t.newVersionAvailable}
                  </h2>
                  <p className="text-amber-100 text-xs mt-0.5">
                    {settings.language === 'zh' ? '更新已下载完成，刷新页面即可应用' : 'Update downloaded! Refresh to apply'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={reload}
                className="flex-1 px-4 py-2 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg font-medium text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
              >
                {t.updateNow}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={close}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg font-medium text-sm border border-slate-700 hover:border-slate-600 transition-all"
              >
                {t.later}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}