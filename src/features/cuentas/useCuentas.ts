import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { Cuenta, TipoCuenta } from '../../types/cuenta'

export function useCuentas(mostrarArchivadas: boolean) {
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargarCuentas = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('cuentas')
      .select('*')
      .eq('archivada', mostrarArchivadas)
      .order('created_at', { ascending: true })

    if (error) {
      setError('No se pudieron cargar las cuentas.')
    } else {
      setCuentas(data ?? [])
    }
    setLoading(false)
  }, [mostrarArchivadas])

  useEffect(() => {
    cargarCuentas()
  }, [cargarCuentas])

  async function crearCuenta(nombre: string, tipo: TipoCuenta, saldoInicial: number) {
    const { data: userData } = await supabase.auth.getUser()
    const usuario_id = userData.user?.id

    const { error } = await supabase
      .from('cuentas')
      .insert({ nombre, tipo, saldo: saldoInicial, usuario_id })

    if (error) return error.message

    await cargarCuentas()
    return null
  }

  async function archivarCuenta(id: string, archivar: boolean) {
    const { error } = await supabase.from('cuentas').update({ archivada: archivar }).eq('id', id)
    if (!error) await cargarCuentas()
  }

  async function eliminarCuenta(id: string) {
    const { error } = await supabase.from('cuentas').delete().eq('id', id)
    if (!error) await cargarCuentas()
  }

  return { cuentas, loading, error, crearCuenta, archivarCuenta, eliminarCuenta }
}