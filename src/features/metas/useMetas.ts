import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { MetaConProgreso } from '../../types/meta'

export function useMetas() {
  const [metas, setMetas] = useState<MetaConProgreso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data: metasData, error: errorMetas } = await supabase
      .from('metas')
      .select('*')
      .order('created_at', { ascending: true })

    if (errorMetas) {
      setError('No se pudieron cargar las metas.')
      setLoading(false)
      return
    }

    const conProgreso = await Promise.all(
      (metasData ?? []).map(async (m) => {
        const { data: aportesData } = await supabase
          .from('aportes_meta')
          .select('monto')
          .eq('meta_id', m.id)

        const aportado = (aportesData ?? []).reduce((acc, a) => acc + Number(a.monto), 0)
        return { ...m, aportado } as MetaConProgreso
      }),
    )

    setMetas(conProgreso)
    setLoading(false)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  async function crearMeta(input: {
    nombre: string
    categoria: string | null
    monto_objetivo: number
    mes_fin: string | null
    color: string | null
    emoji: string | null
    monto_mensual_esperado: number | null
  }) {
    const { data: userData } = await supabase.auth.getUser()
    const usuario_id = userData.user?.id
    if (!usuario_id) return 'No se pudo identificar tu usuario.'

    const { error } = await supabase.from('metas').insert({ ...input, usuario_id })
    if (error) return error.message

    await cargar()
    return null
  }

  async function eliminarMeta(id: string) {
    const { error } = await supabase.from('metas').delete().eq('id', id)
    if (!error) await cargar()
  }

  async function crearAporte(metaId: string, cuentaId: string, monto: number, fecha: string) {
    const { data: userData } = await supabase.auth.getUser()
    const usuario_id = userData.user?.id
    if (!usuario_id) return 'No se pudo identificar tu usuario.'

    const { error } = await supabase
      .from('aportes_meta')
      .insert({ usuario_id, meta_id: metaId, cuenta_id: cuentaId, monto, fecha })

    if (error) {
      if (error.message.toLowerCase().includes('saldo insuficiente')) {
        return 'Ups, no tienes saldo disponible para este aporte.'
      }
      return error.message
    }

    await cargar()
    return null
  }

  return { metas, loading, error, crearMeta, eliminarMeta, crearAporte }
}