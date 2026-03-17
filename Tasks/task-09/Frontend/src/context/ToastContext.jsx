import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // Function to trigger a new notification
  const show = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    // Auto-remove notification after 3.5 seconds
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  const icons = { success: '✓', error: '✕', info: 'ℹ' }
  
  // Custom styles for each toast type using theme colors
  const variants = {
    success: 'border-emerald-500/50 text-emerald-400',
    error: 'border-red-500/50 text-red-400',
    info: 'border-brand-500/50 text-brand-400',
  }

  return (
    <ToastCtx.Provider value={{ showToast: show }}>
      {children}
      {/* Toast container pinned to bottom-right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className={`animate-toast-in flex items-center gap-3 dark-glass
              border-l-4 ${variants[t.type]}
              rounded-xl px-5 py-4 min-w-[300px] shadow-2xl text-sm font-medium font-display pointer-events-auto`}>
            
            {/* Notification Icon */}
            <span className="text-lg font-bold">{icons[t.type]}</span>
            
            {/* Notification Message */}
            <span className="text-white/90">{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}