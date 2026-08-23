export type Deuda = {
  id: string
  usuario_id: string
  acreedor: string
  monto: number
  tasa_interes: number | null
  fecha: string
  created_at: string
}

export type DeudaConProgreso = Deuda & {
  pagado: number
}