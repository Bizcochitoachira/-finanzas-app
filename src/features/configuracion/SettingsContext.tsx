import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../../lib/supabaseClient'

type SettingsContextType = {
  moneda: string
  cambiarMoneda: (moneda: string) => Promise<void>
  formatoMoneda: (monto: number) => string
  cargando: boolean
}

const SettingsContext = createContext<SettingsContextType>({
  moneda: 'COP',
  cambiarMoneda: async () => {},
  formatoMoneda: (monto) => String(monto),
  cargando: true,
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [moneda, setMoneda] = useState('COP')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      const { data: userData } = await supabase.auth.getUser()
      const usuario_id = userData.user?.id
      if (!usuario_id) {
        setCargando(false)
        return
      }

      const { data } = await supabase
        .from('configuracion_usuario')
        .select('moneda')
        .eq('usuario_id', usuario_id)
        .maybeSingle()

      if (data) {
        setMoneda(data.moneda)
      } else {
        await supabase.from('configuracion_usuario').upsert({ usuario_id, moneda: 'COP' })
      }
      setCargando(false)
    }

    cargar()
  }, [])

  async function cambiarMoneda(nuevaMoneda: string) {
    const { data: userData } = await supabase.auth.getUser()
    const usuario_id = userData.user?.id
    if (!usuario_id) return

    await supabase.from('configuracion_usuario').upsert({ usuario_id, moneda: nuevaMoneda })
    setMoneda(nuevaMoneda)
  }

  function formatoMoneda(monto: number) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: moneda,
      maximumFractionDigits: 0,
    }).format(monto)
  }

  return (
    <SettingsContext.Provider value={{ moneda, cambiarMoneda, formatoMoneda, cargando }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}