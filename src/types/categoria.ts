export type TipoCategoria = 'ingreso' | 'gasto'

export type Categoria = {
  id: string
  usuario_id: string
  nombre: string
  tipo: TipoCategoria
  activa: boolean
  created_at: string
}