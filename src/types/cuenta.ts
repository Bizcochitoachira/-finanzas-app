export type TipoCuenta = 'efectivo' | 'banco' | 'tarjeta' | 'billetera_digital' | 'ahorros'

export type Cuenta = {
  id: string
  usuario_id: string
  nombre: string
  tipo: TipoCuenta
  saldo: number
  color: string | null
  icono: string | null
  archivada: boolean
  created_at: string
}