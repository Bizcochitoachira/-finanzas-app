import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const TABLAS = [
  'cuentas',
  'categorias',
  'movimientos',
  'transferencias',
  'presupuestos',
  'metas',
  'aportes_meta',
  'deudas',
  'pagos_deuda',
  'prestamos',
  'pagos_prestamo',
] as const

export function useRespaldo() {
  const [exportando, setExportando] = useState(false)
  const [error, setError] = useState('')

  async function exportarRespaldo() {
    setExportando(true)
    setError('')

    const respaldo: Record<string, unknown[]> = {}

    for (const tabla of TABLAS) {
      const { data, error } = await supabase.from(tabla).select('*')
      if (error) {
        setError(`No se pudo respaldar la tabla "${tabla}": ${error.message}`)
        setExportando(false)
        return
      }
      respaldo[tabla] = data ?? []
    }

    const contenido = JSON.stringify(
      { version: 1, exportado_en: new Date().toISOString(), datos: respaldo },
      null,
      2,
    )

    const blob = new Blob([contenido], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `respaldo_finanzas_${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)

    setExportando(false)
  }

  return { exportarRespaldo, exportando, error }
}