import { useState } from 'react'
import { useMetas } from '../features/metas/useMetas'
import MetaForm from '../features/metas/MetaForm'
import AporteForm from '../features/metas/AporteForm'
import { formatoMoneda } from '../utils/formato'

function MetasPage() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [aportandoA, setAportandoA] = useState<string | null>(null)
  const { metas, loading, error, crearMeta, eliminarMeta, crearAporte } = useMetas()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Metas de ahorro</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="bg-emerald-700 text-white rounded-full px-4 py-2 text-sm font-medium"
        >
          + Crear
        </button>
      </div>

      {mostrarForm && (
        <MetaForm
          onCreate={async (input) => {
            const resultado = await crearMeta(input)
            if (!resultado) setMostrarForm(false)
            return resultado
          }}
          onCancel={() => setMostrarForm(false)}
        />
      )}

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col gap-3">
        {metas.map((m) => {
          const porcentaje = Math.min((m.aportado / m.monto_objetivo) * 100, 100)
          const falta = Math.max(m.monto_objetivo - m.aportado, 0)

          return (
            <div key={m.id} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">
                  {m.emoji} {m.nombre}
                </span>
                <button
                  onClick={() => eliminarMeta(m.id)}
                  className="text-red-400 text-xs font-medium"
                >
                  Eliminar
                </button>
              </div>

              <div className="bg-gray-100 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${porcentaje}%`, backgroundColor: m.color ?? '#2F6F62' }}
                />
              </div>

              <p className="text-xs text-gray-500 tabular-nums mb-1">
                {formatoMoneda.format(m.aportado)} / {formatoMoneda.format(m.monto_objetivo)}
              </p>
              <p className="text-xs text-gray-400 mb-2">
                Faltan {formatoMoneda.format(falta)}
              </p>

              {aportandoA === m.id ? (
                <AporteForm
                  onAportar={async (cuentaId, monto, fecha) => {
                    const resultado = await crearAporte(m.id, cuentaId, monto, fecha)
                    if (!resultado) setAportandoA(null)
                    return resultado
                  }}
                  onCancel={() => setAportandoA(null)}
                />
              ) : (
                <button
                  onClick={() => setAportandoA(m.id)}
                  className="text-emerald-700 text-xs font-medium"
                >
                  + Aportar
                </button>
              )}
            </div>
          )
        })}
      </div>

      {!loading && metas.length === 0 && (
        <p className="text-gray-400 text-sm">Todavía no tienes metas de ahorro.</p>
      )}
    </div>
  )
}

export default MetasPage