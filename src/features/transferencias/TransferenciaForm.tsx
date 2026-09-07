import { useState, type FormEvent } from 'react'
import { useCuentas } from '../cuentas/useCuentas'
import { useToast } from '../notificaciones/ToastContext'

type Props = {
  onCreate: (
    cuentaOrigenId: string,
    cuentaDestinoId: string,
    monto: number,
    fecha: string,
  ) => Promise<string | null>
  onCancel: () => void
}

function TransferenciaForm({ onCreate, onCancel }: Props) {
  const { cuentas } = useCuentas(false)
  const { mostrarToast } = useToast()
  const [origenId, setOrigenId] = useState('')
  const [destinoId, setDestinoId] = useState('')
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const montoNumero = Number(monto)
    if (!montoNumero || montoNumero <= 0) {
      setError('Ingresa un monto válido, mayor a cero.')
      return
    }
    if (!origenId || !destinoId) {
      setError('Selecciona ambas cuentas.')
      return
    }
    if (origenId === destinoId) {
      setError('La cuenta de origen y destino deben ser distintas.')
      return
    }

    setLoading(true)
    const resultado = await onCreate(origenId, destinoId, montoNumero, fecha)
    setLoading(false)

    if (resultado) {
      setError(resultado)
      mostrarToast(resultado, 'error')
    }
  }

  if (cuentas.length < 2) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
        <p className="text-sm text-gray-500">
          Necesitas al menos 2 cuentas para transferir entre ellas.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-4 mb-4">
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <label className="block text-sm mb-1">Desde</label>
      <select
        value={origenId}
        onChange={(e) => setOrigenId(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      >
        <option value="">Selecciona una cuenta</option>
        {cuentas.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <label className="block text-sm mb-1">Hacia</label>
      <select
        value={destinoId}
        onChange={(e) => setDestinoId(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      >
        <option value="">Selecciona una cuenta</option>
        {cuentas.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <label className="block text-sm mb-1">Monto</label>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        placeholder="0"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Fecha</label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-700 text-white rounded-full py-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Transfiriendo...' : 'Transferir'}
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

export default TransferenciaForm