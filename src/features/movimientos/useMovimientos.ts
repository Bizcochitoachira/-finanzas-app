import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { MovimientoConNombres, NuevoMovimiento } from '../../types/movimiento'

export function useMovimientos() {
  const [movimientos, setMovimientos] = useState<MovimientoConNombres[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargarMovimientos = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('movimientos')
      .select('*, cuentas(nombre), categorias(nombre)')
      .order('fecha', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      setError('No se pudieron cargar los movimientos.')
    } else {
      setMovimientos((data as MovimientoConNombres[]) ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    cargarMovimientos()
  }, [cargarMovimientos])

  async function crearMovimiento(input: NuevoMovimiento, archivo: File | null) {
    const { data: userData } = await supabase.auth.getUser()
    const usuario_id = userData.user?.id

    if (!usuario_id) return 'No se pudo identificar tu usuario.'

    let comprobante_url: string | null = null

    if (archivo) {
      const ruta = `${usuario_id}/${Date.now()}_${archivo.name}`
      const { error: errorSubida } = await supabase.storage
        .from('comprobantes')
        .upload(ruta, archivo)

      if (errorSubida) return 'No se pudo subir el comprobante: ' + errorSubida.message

      comprobante_url = ruta
    }

    const { error } = await supabase
      .from('movimientos')
      .insert({ ...input, usuario_id, comprobante_url })

    if (error) return error.message

    await cargarMovimientos()
    return null
  }

  async function eliminarMovimiento(id: string) {
    const { error } = await supabase.from('movimientos').delete().eq('id', id)
    if (!error) await cargarMovimientos()
  }

  async function verComprobante(ruta: string) {
    const { data, error } = await supabase.storage
      .from('comprobantes')
      .createSignedUrl(ruta, 60)

    if (!error && data) {
      window.open(data.signedUrl, '_blank')
    }
  }

  return { movimientos, loading, error, crearMovimiento, eliminarMovimiento, verComprobante }
}