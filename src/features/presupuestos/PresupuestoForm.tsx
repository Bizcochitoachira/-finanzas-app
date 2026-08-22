import { useState, type FormEvent } from 'react'
import { useCategorias } from '../categorias/useCategorias'
import type { Periodo } from '../../types/presupuesto'

type Props = {
  onCreate: (categoriaId: string, montoLimite: number, periodo: Periodo) => Promise<string | null>
  onCancel: () => void
}

function PresupuestoForm({ onCreate, onCancel }: Props) {
  const { categorias } = useCategorias(false)
  const categoriasGasto = categorias.filter((c) => c.tipo === 'gasto')

  const [categoriaId, setCategoriaId] = useState('')
  const [monto, setMonto] = useState('')
  const [periodo, setPeriodo] = useState<Periodo>('mensual')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const montoNumero = Number(monto)
    if (!categoriaId) {
      setError('Selecciona una categoría.')
      return
    }
    if (!montoNumero || montoNumero <= 0) {
      setError('Ingresa un límite válido, mayor a cero.')
      return
    }

    setLoading(true)
    const resultado = await onCreate(categoriaId, montoNumero, periodo)
    setLoading(false)

    if (resultado) setError(resultado)
  }

  if (categoriasGasto.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
        <p className="text-sm text-gray-500">
          Necesitas al menos una categoría de gasto para crear un presupuesto.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-4 mb-4">
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <label className="block text-sm mb-1">Categoría</label>
      <select
        value={categoriaId}
        onChange={(e) => setCategoriaId(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      >
        <option value="">Selecciona una categoría</option>
        {categoriasGasto.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <label className="block text-sm mb-1">Límite</label>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        placeholder="0"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Periodo</label>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setPeriodo('mensual')}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            periodo === 'mensual' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Mensual
        </button>
        <button
          type="button"
          onClick={() => setPeriodo('anual')}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            periodo === 'anual' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Anual
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-700 text-white rounded-full py-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar presupuesto'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 rounded-full py-2 font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default PresupuestoForm