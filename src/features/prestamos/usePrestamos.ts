import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { PrestamoConProgreso, TipoPrestamo } from '../../types/prestamo'

export function usePrestamos() {
  const [prestamos, setPrestamos] = useState<PrestamoConProgreso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data: prestamosData, error: errorPrestamos } = await supabase
      .from('prestamos')
      .select('*')
      .order('created_at', { ascending: true })

    if (errorPrestamos) {
      setError('No se pudieron cargar los préstamos.')
      setLoading(false)
      return
    }

    const conProgreso = await Promise.all(
      (prestamosData ?? []).map(async (p) => {
        const { data: pagosData } = await supabase
          .from('pagos_prestamo')
          .select('monto')
          .eq('prestamo_id', p.id)

        const pagado = (pagosData ?? []).reduce((acc, x) => acc + Number(x.monto), 0)
        return { ...p, pagado } as PrestamoConProgreso
      }),
    )

    setPrestamos(conProgreso)
    setLoading(false)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  async function crearPrestamo(
    tipo: TipoPrestamo,
    persona: string,
    monto: number,
    cuentaId: string,
    fecha: string,
  ) {
    const { data: userData } = await supabase.auth.getUser()
    const usuario_id = userData.user?.id
    if (!usuario_id) return 'No se pudo identificar tu usuario.'

    const { error } = await supabase
      .from('prestamos')
      .insert({ usuario_id, tipo, persona, monto, cuenta_id: cuentaId, fecha })

    if (error) {
      if (error.message.toLowerCase().includes('saldo insuficiente')) {
        return 'Ups, no tienes saldo disponible para prestar ese monto.'
      }
      return error.message
    }
    await cargar()
    return null
  }

  async function eliminarPrestamo(id: string) {
    const { error } = await supabase.from('prestamos').delete().eq('id', id)
    if (!error) await cargar()
  }

  async function crearPago(prestamoId: string, cuentaId: string, monto: number, fecha: string) {
    const { data: userData } = await supabase.auth.getUser()
    const usuario_id = userData.user?.id
    if (!usuario_id) return 'No se pudo identificar tu usuario.'

    const { error } = await supabase
      .from('pagos_prestamo')
      .insert({ usuario_id, prestamo_id: prestamoId, cuenta_id: cuentaId, monto, fecha })

    if (error) {
      if (error.message.toLowerCase().includes('saldo insuficiente')) {
        return 'Ups, no tienes saldo disponible para este pago.'
      }
      return error.message
    }
    await cargar()
    return null
  }

  return { prestamos, loading, error, crearPrestamo, eliminarPrestamo, crearPago }
}