export type TipoMovimiento = 'ingreso' | 'gasto'

export type Movimiento = {
  id: string
  usuario_id: string
  cuenta_id: string
  categoria_id: string | null
  tipo: TipoMovimiento
  monto: number
  fecha: string
  nota: string | null
  comprobante_url: string | null
  etiquetas: string[] | null
  created_at: string
}

export type MovimientoConNombres = Movimiento & {
  cuentas: { nombre: string } | null
  categorias: { nombre: string } | null
}

export type NuevoMovimiento = {
  cuenta_id: string
  categoria_id: string | null
  tipo: TipoMovimiento
  monto: number
  fecha: string
  nota: string | null
  etiquetas: string[] | null
}