import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { TransferenciaConNombres } from '../../types/transferencia'

export function useTransferencias() {
  const [transferencias, setTransferencias] = useState<TransferenciaConNombres[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('transferencias')
      .select('*, origen:cuentas!cuenta_origen_id(nombre), destino:cuentas!cuenta_destino_id(nombre)')
      .order('fecha', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) {
      setError('No se pudieron cargar las transferencias.')
    } else {
      setTransferencias((data as TransferenciaConNombres[]) ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  async function crearTransferencia(
    cuentaOrigenId: string,
    cuentaDestinoId: string,
    monto: number,
    fecha: string,
  ) {
    const { data: userData } = await supabase.auth.getUser()
    const usuario_id = userData.user?.id
    if (!usuario_id) return 'No se pudo identificar tu usuario.'

    const { error } = await supabase.from('transferencias').insert({
      usuario_id,
      cuenta_origen_id: cuentaOrigenId,
      cuenta_destino_id: cuentaDestinoId,
      monto,
      fecha,
    })

    if (error) {
      if (error.message.toLowerCase().includes('saldo insuficiente')) {
        return 'Ups, no tienes saldo disponible para esta transferencia.'
      }
      return error.message
    }

    await cargar()
    return null
  }

  return { transferencias, loading, error, crearTransferencia }
}