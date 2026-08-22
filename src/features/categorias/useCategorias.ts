import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { Categoria, TipoCategoria } from '../../types/categoria'

export function useCategorias(mostrarInactivas: boolean) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargarCategorias = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('activa', !mostrarInactivas)
      .order('created_at', { ascending: true })

    if (error) {
      setError('No se pudieron cargar las categorías.')
    } else {
      setCategorias(data ?? [])
    }
    setLoading(false)
  }, [mostrarInactivas])

  useEffect(() => {
    cargarCategorias()
  }, [cargarCategorias])

  async function crearCategoria(nombre: string, tipo: TipoCategoria) {
    const { data: userData } = await supabase.auth.getUser()
    const usuario_id = userData.user?.id

    const { error } = await supabase.from('categorias').insert({ nombre, tipo, usuario_id })

    if (error) return error.message

    await cargarCategorias()
    return null
  }

  async function cambiarActiva(id: string, activa: boolean) {
    const { error } = await supabase.from('categorias').update({ activa }).eq('id', id)
    if (!error) await cargarCategorias()
  }

  async function eliminarCategoria(id: string) {
    const { error } = await supabase.from('categorias').delete().eq('id', id)
    if (!error) await cargarCategorias()
  }

  return { categorias, loading, error, crearCategoria, cambiarActiva, eliminarCategoria }
}