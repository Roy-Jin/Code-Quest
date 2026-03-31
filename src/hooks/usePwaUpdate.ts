import { useState, useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function usePwaUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      if (registration) {
        setInterval(() => {
          registration.update()
        }, 60_000)
      }
    }
  })

  const [showReloadPrompt, setShowReloadPrompt] = useState(false)

  useEffect(() => {
    if (needRefresh) {
      setShowReloadPrompt(true)
    }
  }, [needRefresh])

  const close = () => {
    setShowReloadPrompt(false)
  }

  const reload = async () => {
    await updateServiceWorker()
    setShowReloadPrompt(false)
  }

  return {
    showReloadPrompt,
    close,
    reload
  }
}