export type TipoPrestamo = 'dado' | 'recibido'

export type Prestamo = {
  id: string
  usuario_id: string
  tipo: TipoPrestamo
  persona: string
  monto: number
  cuenta_id: string
  fecha: string
  created_at: string
}

export type PrestamoConProgreso = Prestamo & {
  pagado: number
}