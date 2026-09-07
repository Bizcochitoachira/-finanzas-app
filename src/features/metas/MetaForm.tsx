import { useState, type FormEvent } from 'react'
import { esMesFuturo } from '../../utils/validaciones'

type Props = {
  onCreate: (input: {
    nombre: string
    categoria: string | null
    monto_objetivo: number
    mes_fin: string | null
    color: string | null
    emoji: string | null
    monto_mensual_esperado: number | null
  }) => Promise<string | null>
  onCancel: () => void
}

function MetaForm({ onCreate, onCancel }: Props) {
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('')
  const [montoObjetivo, setMontoObjetivo] = useState('')
  const [mesFin, setMesFin] = useState('')
  const [color, setColor] = useState('#2F6F62')
  const [emoji, setEmoji] = useState('🎯')
  const [montoMensual, setMontoMensual] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!nombre.trim()) {
      setError('Ponle un nombre a la meta.')
      return
    }
    const montoNumero = Number(montoObjetivo)
    if (!montoNumero || montoNumero <= 0) {
      setError('Ingresa un monto objetivo válido, mayor a cero.')
      return
    }
    if (mesFin && !esMesFuturo(mesFin)) {
      setError('La fecha de finalización debe ser un mes futuro.')
      return
    }

    setLoading(true)
    const resultado = await onCreate({
      nombre: nombre.trim(),
      categoria: categoria.trim() || null,
      monto_objetivo: montoNumero,
      mes_fin: mesFin ? `${mesFin}-01` : null,
      color,
      emoji: emoji.trim() || null,
      monto_mensual_esperado: montoMensual ? Number(montoMensual) : null,
    })
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
        placeholder="Ej. Viaje a la playa"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Categoría (opcional)</label>
      <input
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        placeholder="Ej. Viajes"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Monto objetivo</label>
      <input
        type="number"
        value={montoObjetivo}
        onChange={(e) => setMontoObjetivo(e.target.value)}
        placeholder="0"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Mes de finalización (opcional)</label>
      <input
        type="month"
        value={mesFin}
        onChange={(e) => setMesFin(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Aporte mensual esperado (opcional)</label>
      <input
        type="number"
        value={montoMensual}
        onChange={(e) => setMontoMensual(e.target.value)}
        placeholder="0"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-sm mb-1">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 rounded-lg border border-gray-300"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">Emoji</label>
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            maxLength={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center text-xl"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-700 text-white rounded-full py-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar meta'}
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

export default MetaForm