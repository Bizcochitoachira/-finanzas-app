export type Periodo = 'mensual' | 'anual'

export type Presupuesto = {
  id: string
  usuario_id: string
  categoria_id: string
  monto_limite: number
  periodo: Periodo
  created_at: string
}

export type PresupuestoConProgreso = Presupuesto & {
  nombreCategoria: string
  gastado: number
}