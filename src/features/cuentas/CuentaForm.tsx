import { useState, type FormEvent } from 'react'
import type { TipoCuenta } from '../../types/cuenta'

type Props = {
  onCreate: (nombre: string, tipo: TipoCuenta, saldoInicial: number) => Promise<string | null>
  onCancel: () => void
}

const TIPOS: { value: TipoCuenta; label: string }[] = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'banco', label: 'Banco' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'billetera_digital', label: 'Billetera digital' },
  { value: 'ahorros', label: 'Ahorros' },
]

function CuentaForm({ onCreate, onCancel }: Props) {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<TipoCuenta>('banco')
  const [saldo, setSaldo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!nombre.trim()) {
      setError('Ponle un nombre a la cuenta.')
      return
    }

    setLoading(true)
    const resultado = await onCreate(nombre.trim(), tipo, Number(saldo) || 0)
    setLoading(false)

    if (resultado) {
      setError(resultado)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-4 mb-4">
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <label className="block text-sm mb-1">Nombre</label>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej. Banco Principal"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Tipo</label>
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value as TipoCuenta)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      >
        {TIPOS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <label className="block text-sm mb-1">Saldo inicial (opcional)</label>
      <input
        type="number"
        value={saldo}
        onChange={(e) => setSaldo(e.target.value)}
        placeholder="0"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-700 text-white rounded-full py-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar cuenta'}
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

export default CuentaForm