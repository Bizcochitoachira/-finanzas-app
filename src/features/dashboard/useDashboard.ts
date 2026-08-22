import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type MovimientoDelMes = {
  tipo: 'ingreso' | 'gasto'
  monto: number
  categorias: { nombre: string } | null
}

type MovimientoResumen = {
  id: string
  tipo: 'ingreso' | 'gasto'
  monto: number
  fecha: string
  nota: string | null
  cuentas: { nombre: string } | null
  categorias: { nombre: string } | null
}

export function useDashboard() {
  const [balanceTotal, setBalanceTotal] = useState(0)
  const [ingresosMes, setIngresosMes] = useState(0)
  const [gastosMes, setGastosMes] = useState(0)
  const [gastosPorCategoria, setGastosPorCategoria] = useState<{ nombre: string; monto: number }[]>([])
  const [ultimosMovimientos, setUltimosMovimientos] = useState<MovimientoResumen[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      setLoading(true)
      setError('')

      const hoy = new Date()
      const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10)
      const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().slice(0, 10)

      const [cuentasRes, movimientosMesRes, ultimosRes] = await Promise.all([
        supabase.from('cuentas').select('saldo').eq('archivada', false),
        supabase
          .from('movimientos')
          .select('tipo, monto, categorias(nombre)')
          .gte('fecha', primerDia)
          .lte('fecha', ultimoDia),
        supabase
          .from('movimientos')
          .select('id, tipo, monto, fecha, nota, cuentas(nombre), categorias(nombre)')
          .order('fecha', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      if (cuentasRes.error || movimientosMesRes.error || ultimosRes.error) {
        setError('No se pudo cargar la información de Inicio.')
        setLoading(false)
        return
      }

      const balance = (cuentasRes.data ?? []).reduce((acc, c) => acc + Number(c.saldo), 0)
      setBalanceTotal(balance)

      let ingresos = 0
      let gastos = 0
      const porCategoria = new Map<string, number>()

      for (const m of (movimientosMesRes.data as MovimientoDelMes[]) ?? []) {
        if (m.tipo === 'ingreso') {
          ingresos += Number(m.monto)
        } else {
          gastos += Number(m.monto)
          const nombre = m.categorias?.nombre ?? 'Sin categoría'
          porCategoria.set(nombre, (porCategoria.get(nombre) ?? 0) + Number(m.monto))
        }
      }

      setIngresosMes(ingresos)
      setGastosMes(gastos)
      setGastosPorCategoria(
        Array.from(porCategoria, ([nombre, monto]) => ({ nombre, monto })).sort(
          (a, b) => b.monto - a.monto,
        ),
      )
      setUltimosMovimientos((ultimosRes.data as MovimientoResumen[]) ?? [])
      setLoading(false)
    }

    cargar()
  }, [])

  return {
    balanceTotal,
    ingresosMes,
    gastosMes,
    gastosPorCategoria,
    ultimosMovimientos,
    loading,
    error,
  }
}