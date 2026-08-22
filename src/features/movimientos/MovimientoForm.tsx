import { useState, type FormEvent } from 'react'
import { useCuentas } from '../cuentas/useCuentas'
import { useCategorias } from '../categorias/useCategorias'
import type { TipoMovimiento, NuevoMovimiento } from '../../types/movimiento'

type Props = {
  onCreate: (input: NuevoMovimiento, archivo: File | null) => Promise<string | null>
  onCancel: () => void
}

function MovimientoForm({ onCreate, onCancel }: Props) {
  const { cuentas } = useCuentas(false)
  const { categorias } = useCategorias(false)

  const [tipo, setTipo] = useState<TipoMovimiento>('gasto')
  const [monto, setMonto] = useState('')
  const [cuentaId, setCuentaId] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [nota, setNota] = useState('')
  const [etiquetasTexto, setEtiquetasTexto] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [avisoSinComprobante, setAvisoSinComprobante] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipo)

  function construirInput(): NuevoMovimiento | string {
    const montoNumero = Number(monto)
    if (!montoNumero || montoNumero <= 0) return 'Ingresa un monto válido, mayor a cero.'
    if (!cuentaId) return 'Selecciona una cuenta.'

    const etiquetas = etiquetasTexto
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length > 0)

    return {
      tipo,
      monto: montoNumero,
      cuenta_id: cuentaId,
      categoria_id: categoriaId || null,
      fecha,
      nota: nota.trim() || null,
      etiquetas: etiquetas.length > 0 ? etiquetas : null,
    }
  }

  async function enviar(input: NuevoMovimiento) {
    setLoading(true)
    const resultado = await onCreate(input, archivo)
    setLoading(false)
    if (resultado) setError(resultado)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const input = construirInput()
    if (typeof input === 'string') {
      setError(input)
      return
    }

    if (!archivo && !avisoSinComprobante) {
      setAvisoSinComprobante(true)
      return
    }

    await enviar(input)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-4 mb-4">
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => {
            setTipo('gasto')
            setCategoriaId('')
          }}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            tipo === 'gasto' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Gasto
        </button>
        <button
          type="button"
          onClick={() => {
            setTipo('ingreso')
            setCategoriaId('')
          }}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            tipo === 'ingreso' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Ingreso
        </button>
      </div>

      <label className="block text-sm mb-1">Monto</label>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        placeholder="0"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Cuenta</label>
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

      <label className="block text-sm mb-1">Categoría (opcional)</label>
      <select
        value={categoriaId}
        onChange={(e) => setCategoriaId(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      >
        <option value="">Sin categoría</option>
        {categoriasFiltradas.map((c) => (
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
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Nota (opcional)</label>
      <input
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        placeholder="Ej. Compra de pan"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Etiquetas (opcional, separadas por coma)</label>
      <input
        value={etiquetasTexto}
        onChange={(e) => setEtiquetasTexto(e.target.value)}
        placeholder="Ej. urgente, casa"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
      />

      <label className="block text-sm mb-1">Comprobante (opcional)</label>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          setArchivo(e.target.files?.[0] ?? null)
          setAvisoSinComprobante(false)
        }}
        className="w-full text-sm mb-3"
      />

      {avisoSinComprobante && (
        <div className="bg-amber-50 text-amber-800 text-sm rounded-lg p-3 mb-4">
          Más adelante podrías no recordar este registro sin una foto del comprobante. ¿Seguro que
          quieres continuar sin agregarla?
          <button
            type="button"
            onClick={async () => {
              const input = construirInput()
              if (typeof input === 'string') {
                setError(input)
                return
              }
              await enviar(input)
            }}
            className="block mt-2 text-amber-900 font-medium underline"
          >
            Guardar sin comprobante
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-700 text-white rounded-full py-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar movimiento'}
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

export default MovimientoForm