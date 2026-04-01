import { useState, useEffect, useRef } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function usePwaUpdate() {
  // Always register Service Worker for PWA updates in all environments
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        setInterval(() => {
          registration.update()
        }, 60_000) // Check every minute
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error)
    }
  })

  const [showReloadPrompt, setShowReloadPrompt] = useState(false)
  const [updatePending, setUpdatePending] = useState(false)
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null)
  const needRefreshRef = useRef(needRefresh)

  // Store registration reference
  useEffect(() => {
    navigator.serviceWorker?.getRegistration().then(reg => {
      if (reg) {
        registrationRef.current = reg
      }
    })
  }, [])

  // Update needRefresh ref when needRefresh changes
  useEffect(() => {
    needRefreshRef.current = needRefresh
  }, [needRefresh])

  useEffect(() => {
    if (needRefresh) {
      setShowReloadPrompt(true)
      setUpdatePending(true)
    }
  }, [needRefresh])

  const close = () => {
    setShowReloadPrompt(false)
    // Keep updatePending true since update is already downloaded
  }

  const reload = async () => {
    await updateServiceWorker(true)
  }

  const checkForUpdate = async (): Promise<boolean> => {
    try {
      const registration = registrationRef.current || await navigator.serviceWorker?.getRegistration()
      if (registration) {
        registrationRef.current = registration
        
        // Check immediately if update is already available
        if (needRefreshRef.current) {
          return true
        }
        
        await registration.update()
        
        // Wait longer and check more frequently for updates
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve(false)
          }, 5000) // Increased from 2s to 5s

          // Check every 500ms for updates
          const interval = setInterval(() => {
            if (needRefreshRef.current) {
              clearTimeout(timeout)
              clearInterval(interval)
              resolve(true)
            }
          }, 500)

          // Also check immediately (in case needRefresh changed during await)
          if (needRefreshRef.current) {
            clearTimeout(timeout)
            clearInterval(interval)
            resolve(true)
          }
        })
      }
      return false
    } catch (error) {
      console.error('Error checking for updates:', error)
      return false
    }
  }

  return {
    showReloadPrompt,
    updatePending,
    needRefresh,
    close,
    reload,
    checkForUpdate
  }
}