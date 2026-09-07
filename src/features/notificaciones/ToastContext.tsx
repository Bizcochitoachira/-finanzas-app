import { createContext, useContext, useState, type ReactNode } from 'react'

type Toast = { id: number; mensaje: string; tipo: 'error' | 'exito' }

type ToastContextType = {
  mostrarToast: (mensaje: string, tipo?: 'error' | 'exito') => void
}

const ToastContext = createContext<ToastContextType>({ mostrarToast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  function mostrarToast(mensaje: string, tipo: 'error' | 'exito' = 'error') {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, mensaje, tipo }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <div className="fixed top-4 left-4 right-4 flex flex-col gap-2 z-50 items-center pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto max-w-sm w-full text-white text-sm font-medium rounded-xl px-4 py-3 shadow-lg ${
              t.tipo === 'error' ? 'bg-red-600' : 'bg-emerald-700'
            }`}
          >
            {t.mensaje}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}