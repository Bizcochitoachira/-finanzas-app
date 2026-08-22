export type Transferencia = {
  id: string
  usuario_id: string
  cuenta_origen_id: string
  cuenta_destino_id: string
  monto: number
  fecha: string
  created_at: string
}

export type TransferenciaConNombres = Transferencia & {
  origen: { nombre: string } | null
  destino: { nombre: string } | null
}