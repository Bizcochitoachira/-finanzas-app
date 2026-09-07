import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type ResumenPeriodo = { ingresos: number; gastos: number }
type CategoriaGasto = { nombre: string; monto: number }

type MovimientoExport = {
  fecha: string
  tipo: string
  monto: number
  nota: string | null
  cuentas: { nombre: string } | null
  categorias: { nombre: string } | null
}

export function useReportes() {
  const [mesActual, setMesActual] = useState<ResumenPeriodo>({ ingresos: 0, gastos: 0 })
  const [mesAnterior, setMesAnterior] = useState<ResumenPeriodo>({ ingresos: 0, gastos: 0 })
  const [topCategorias, setTopCategorias] = useState<CategoriaGasto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      setLoading(true)
      setError('')

      const hoy = new Date()
      const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        .toISOString()
        .slice(0, 10)
      const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)
        .toISOString()
        .slice(0, 10)
      const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0)
        .toISOString()
        .slice(0, 10)

      const [actualRes, anteriorRes] = await Promise.all([
        supabase
          .from('movimientos')
          .select('tipo, monto, categorias(nombre)')
          .gte('fecha', inicioMesActual),
        supabase
          .from('movimientos')
          .select('tipo, monto')
          .gte('fecha', inicioMesAnterior)
          .lte('fecha', finMesAnterior),
      ])

      if (actualRes.error || anteriorRes.error) {
        setError('No se pudieron cargar los reportes.')
        setLoading(false)
        return
      }

      function resumir(datos: { tipo: string; monto: number }[]) {
        return datos.reduce(
          (acc, m) => {
            if (m.tipo === 'ingreso') acc.ingresos += Number(m.monto)
            else acc.gastos += Number(m.monto)
            return acc
          },
          { ingresos: 0, gastos: 0 },
        )
      }

      setMesActual(resumir(actualRes.data ?? []))
      setMesAnterior(resumir(anteriorRes.data ?? []))

      const porCategoria = new Map<string, number>()
      for (const m of (actualRes.data as unknown as MovimientoExport[]) ?? []) {
        if (m.tipo !== 'gasto') continue
        const nombre = m.categorias?.nombre ?? 'Sin categoría'
        porCategoria.set(nombre, (porCategoria.get(nombre) ?? 0) + Number(m.monto))
      }

      setTopCategorias(
        Array.from(porCategoria, ([nombre, monto]) => ({ nombre, monto }))
          .sort((a, b) => b.monto - a.monto)
          .slice(0, 5),
      )

      setLoading(false)
    }

    cargar()
  }, [])

  async function exportarCSV() {
    const { data, error } = await supabase
      .from('movimientos')
      .select('fecha, tipo, monto, nota, cuentas(nombre), categorias(nombre)')
      .order('fecha', { ascending: false })

    if (error || !data) return

    const filas = data as unknown as MovimientoExport[]
    const encabezado = 'Fecha,Tipo,Monto,Cuenta,Categoria,Nota\n'
    const cuerpo = filas
      .map((m) => {
        const nota = (m.nota ?? '').replace(/,/g, ';')
        return `${m.fecha},${m.tipo},${m.monto},${m.cuentas?.nombre ?? ''},${
          m.categorias?.nombre ?? 'Sin categoría'
        },${nota}`
      })
      .join('\n')

    const csv = encabezado + cuerpo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `movimientos_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return { mesActual, mesAnterior, topCategorias, loading, error, exportarCSV }
}