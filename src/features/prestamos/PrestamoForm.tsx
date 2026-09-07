import { useState, type FormEvent } from 'react'
import { useCuentas } from '../cuentas/useCuentas'
import { useToast } from '../notificaciones/ToastContext'
import type { TipoPrestamo } from '../../types/prestamo'

type Props = {
  onCreate: (
    tipo: TipoPrestamo,
    persona: string,
    monto: number,
    cuentaId: string,
    fecha: string,
  ) => Promise<string | null>
  onCancel: () => void
}

function PrestamoForm({ onCreate, onCancel }: Props) {
  const { cuentas } = useCuentas(false)
  const { mostrarToast } = useToast()
  const [tipo, setTipo] = useState<TipoPrestamo>('dado')
  const [persona, setPersona] = useState('')
  const [monto, setMonto] = useState('')
  const [cuentaId, setCuentaId] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!persona.trim()) {
      setError('Indica el nombre de la persona.')
      return
    }
    const montoNumero = Number(monto)
    if (!montoNumero || montoNumero <= 0) {
      setError('Ingresa un monto válido.')
      return
    }
    if (!cuentaId) {
      setError('Selecciona una cuenta.')
      return
    }

    setLoading(true)
    const resultado = await onCreate(tipo, persona.trim(), montoNumero, cuentaId, fecha)
    setLoading(false)

    if (resultado) {
      setError(resultado)
      mostrarToast(resultado, 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-4 mb-4">
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTipo('dado')}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            tipo === 'dado' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Yo presté
        </button>
        <button
          type="button"
          onClick={() => setTipo('recibido')}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            tipo === 'recibido' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Me prestaron
        </button>
      </div>

      <label className="block text-sm mb-1">
        {tipo === 'dado' ? '¿A quién le prestaste?' : '¿Quién te prestó?'}
      </label>
      <input
        value={persona}
        onChange={(e) => setPersona(e.target.value)}
        placeholder="Nombre"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Monto</label>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        placeholder="0"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">
        {tipo === 'dado' ? 'Cuenta desde donde sale el dinero' : 'Cuenta a donde entra el dinero'}
      </label>
      <select
        value={cuentaId}
        onChange={(e) => setCuentaId(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      >
        <option value="">Selecciona una cuenta</option>
        {cuentas.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

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
          {loading ? 'Guardando...' : 'Guardar préstamo'}
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

export default PrestamoForm