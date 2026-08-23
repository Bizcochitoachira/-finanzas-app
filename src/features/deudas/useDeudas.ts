import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { DeudaConProgreso } from '../../types/deuda'

export function useDeudas() {
  const [deudas, setDeudas] = useState<DeudaConProgreso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data: deudasData, error: errorDeudas } = await supabase
      .from('deudas')
      .select('*')
      .order('created_at', { ascending: true })

    if (errorDeudas) {
      setError('No se pudieron cargar las deudas.')
      setLoading(false)
      return
    }

    const conProgreso = await Promise.all(
      (deudasData ?? []).map(async (d) => {
        const { data: pagosData } = await supabase
          .from('pagos_deuda')
          .select('monto')
          .eq('deuda_id', d.id)

        const pagado = (pagosData ?? []).reduce((acc, p) => acc + Number(p.monto), 0)
        return { ...d, pagado } as DeudaConProgreso
      }),
    )

    setDeudas(conProgreso)
    setLoading(false)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  async function crearDeuda(acreedor: string, monto: number, tasaInteres: number | null) {
    const { data: userData } = await supabase.auth.getUser()
    const usuario_id = userData.user?.id
    if (!usuario_id) return 'No se pudo identificar tu usuario.'

    const { error } = await supabase
      .from('deudas')
      .insert({ usuario_id, acreedor, monto, tasa_interes: tasaInteres })

    if (error) return error.message
    await cargar()
    return null
  }

  async function eliminarDeuda(id: string) {
    const { error } = await supabase.from('deudas').delete().eq('id', id)
    if (!error) await cargar()
  }

  async function crearPago(deudaId: string, cuentaId: string, monto: number, fecha: string) {
    const { data: userData } = await supabase.auth.getUser()
    const usuario_id = userData.user?.id
    if (!usuario_id) return 'No se pudo identificar tu usuario.'

    const { error } = await supabase
      .from('pagos_deuda')
      .insert({ usuario_id, deuda_id: deudaId, cuenta_id: cuentaId, monto, fecha })

    if (error) {
      if (error.message.toLowerCase().includes('saldo insuficiente')) {
        return 'Ups, no tienes saldo disponible para este pago.'
      }
      return error.message
    }
    await cargar()
    return null
  }

  return { deudas, loading, error, crearDeuda, eliminarDeuda, crearPago }
}