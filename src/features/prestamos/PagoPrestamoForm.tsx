import { useState, type FormEvent } from 'react'
import { useCuentas } from '../cuentas/useCuentas'

type Props = {
  etiqueta: string
  onPagar: (cuentaId: string, monto: number, fecha: string) => Promise<string | null>
  onCancel: () => void
}

function PagoPrestamoForm({ etiqueta, onPagar, onCancel }: Props) {
  const { cuentas } = useCuentas(false)
  const [cuentaId, setCuentaId] = useState('')
  const [monto, setMonto] = useState('')
  const [fecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const montoNumero = Number(monto)
    if (!cuentaId) {
      setError('Selecciona una cuenta.')
      return
    }
    if (!montoNumero || montoNumero <= 0) {
      setError('Ingresa un monto válido.')
      return
    }

    setLoading(true)
    const resultado = await onPagar(cuentaId, montoNumero, fecha)
    setLoading(false)
    if (resultado) setError(resultado)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-3 mt-2">
      {error && <p className="text-red-600 text-xs mb-2">{error}</p>}

      <select
        value={cuentaId}
        onChange={(e) => setCuentaId(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 text-sm"
      >
        <option value="">{etiqueta}</option>
        {cuentas.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        placeholder="Monto"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 text-sm"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-700 text-white rounded-full py-1.5 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Confirmar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 rounded-full py-1.5 text-sm font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default PagoPrestamoForm