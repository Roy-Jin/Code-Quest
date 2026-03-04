import { useEffect, useState } from 'react';

interface PwaUpdatePromptProps {
  onRefresh?: () => void;
  t: {
    newVersionAvailable: string;
    newVersionDesc: string;
    refreshNow: string;
    later: string;
  };
}

export function PwaUpdatePrompt({ onRefresh, t }: PwaUpdatePromptProps) {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Get the registration
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Check for updates periodically (every hour)
        const updateInterval = setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000);

        // Listen for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              setShowUpdate(true);
              console.log('New version available!');
            }
          });
        });

        return () => clearInterval(updateInterval);
      });

      // Listen for controller change (when new SW takes over)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    
    if (registration?.waiting) {
      // Tell the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      // Fallback: just reload
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {t.newVersionAvailable}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t.newVersionDesc}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleRefresh}
          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
        >
          {t.refreshNow}
        </button>
        <button
          onClick={handleDismiss}
          className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
        >
          {t.later}
        </button>
      </div>
    </div>
  );
}
