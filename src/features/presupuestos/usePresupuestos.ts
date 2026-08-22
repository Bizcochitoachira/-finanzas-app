import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { Periodo, PresupuestoConProgreso } from '../../types/presupuesto'

export function usePresupuestos() {
  const [presupuestos, setPresupuestos] = useState<PresupuestoConProgreso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data: presupuestosData, error: errorPresupuestos } = await supabase
      .from('presupuestos')
      .select('*, categorias(nombre)')
      .order('created_at', { ascending: true })

    if (errorPresupuestos) {
      setError('No se pudieron cargar los presupuestos.')
      setLoading(false)
      return
    }

    const hoy = new Date()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10)
    const inicioAnio = new Date(hoy.getFullYear(), 0, 1).toISOString().slice(0, 10)

    const conProgreso = await Promise.all(
      (presupuestosData ?? []).map(async (p) => {
        const desde = p.periodo === 'mensual' ? inicioMes : inicioAnio

        const { data: gastosData } = await supabase
          .from('movimientos')
          .select('monto')
          .eq('categoria_id', p.categoria_id)
          .eq('tipo', 'gasto')
          .gte('fecha', desde)

        const gastado = (gastosData ?? []).reduce((acc, g) => acc + Number(g.monto), 0)

        return {
          ...p,
          nombreCategoria: (p as unknown as { categorias: { nombre: string } | null }).categorias
            ?.nombre ?? 'Sin categoría',
          gastado,
        } as PresupuestoConProgreso
      }),
    )

    setPresupuestos(conProgreso)
    setLoading(false)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  async function crearPresupuesto(categoriaId: string, montoLimite: number, periodo: Periodo) {
    const { data: userData } = await supabase.auth.getUser()
    const usuario_id = userData.user?.id
    if (!usuario_id) return 'No se pudo identificar tu usuario.'

    const { error } = await supabase
      .from('presupuestos')
      .insert({ usuario_id, categoria_id: categoriaId, monto_limite: montoLimite, periodo })

    if (error) return error.message

    await cargar()
    return null
  }

  async function eliminarPresupuesto(id: string) {
    const { error } = await supabase.from('presupuestos').delete().eq('id', id)
    if (!error) await cargar()
  }

  return { presupuestos, loading, error, crearPresupuesto, eliminarPresupuesto }
}