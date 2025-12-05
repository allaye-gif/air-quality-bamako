import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([])
  const toast = useCallback(({ title, description, variant = "default" }: any) => {
    const id = Math.random()
    setToasts(prev => [...prev, { id, title, description, variant }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])
  return { toast, toasts }
}