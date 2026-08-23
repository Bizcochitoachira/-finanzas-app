import { useState, type FormEvent } from 'react'

type Props = {
  onCreate: (acreedor: string, monto: number, tasaInteres: number | null) => Promise<string | null>
  onCancel: () => void
}

function DeudaForm({ onCreate, onCancel }: Props) {
  const [acreedor, setAcreedor] = useState('')
  const [monto, setMonto] = useState('')
  const [tasaInteres, setTasaInteres] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!acreedor.trim()) {
      setError('Indica a quién le debes.')
      return
    }
    const montoNumero = Number(monto)
    if (!montoNumero || montoNumero <= 0) {
      setError('Ingresa un monto válido.')
      return
    }

    setLoading(true)
    const resultado = await onCreate(
      acreedor.trim(),
      montoNumero,
      tasaInteres ? Number(tasaInteres) : null,
    )
    setLoading(false)
    if (resultado) setError(resultado)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-4 mb-4">
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <label className="block text-sm mb-1">¿A quién le debes?</label>
      <input
        value={acreedor}
        onChange={(e) => setAcreedor(e.target.value)}
        placeholder="Ej. Banco XYZ"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Monto total</label>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        placeholder="0"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Tasa de interés % (opcional)</label>
      <input
        type="number"
        value={tasaInteres}
        onChange={(e) => setTasaInteres(e.target.value)}
        placeholder="0"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-700 text-white rounded-full py-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar deuda'}
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

export default DeudaForm