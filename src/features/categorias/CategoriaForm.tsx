import { useState, type FormEvent } from 'react'
import type { TipoCategoria } from '../../types/categoria'

type Props = {
  onCreate: (nombre: string, tipo: TipoCategoria) => Promise<string | null>
  onCancel: () => void
}

function CategoriaForm({ onCreate, onCancel }: Props) {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<TipoCategoria>('gasto')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!nombre.trim()) {
      setError('Ponle un nombre a la categoría.')
      return
    }

    setLoading(true)
    const resultado = await onCreate(nombre.trim(), tipo)
    setLoading(false)

    if (resultado) setError(resultado)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-4 mb-4">
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <label className="block text-sm mb-1">Nombre</label>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej. Alimentación"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Tipo</label>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTipo('gasto')}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            tipo === 'gasto' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Gasto
        </button>
        <button
          type="button"
          onClick={() => setTipo('ingreso')}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            tipo === 'ingreso' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Ingreso
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-700 text-white rounded-full py-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar categoría'}
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

export default CategoriaForm