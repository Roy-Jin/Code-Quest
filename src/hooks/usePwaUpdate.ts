import { useState, useEffect, useRef } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function usePwaUpdate() {
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

  // Store registration reference
  useEffect(() => {
    navigator.serviceWorker?.getRegistration().then(reg => {
      if (reg) {
        registrationRef.current = reg
      }
    })
  }, [])

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
        await registration.update()
        
        // Wait a bit to see if an update was found
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve(false)
          }, 2000)

          const checkUpdate = () => {
            if (needRefresh) {
              clearTimeout(timeout)
              resolve(true)
            }
          }

          // Check immediately and after a short delay
          checkUpdate()
          setTimeout(checkUpdate, 1000)
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