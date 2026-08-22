import { useState } from 'react'
import { useMovimientos } from '../features/movimientos/useMovimientos'
import MovimientoForm from '../features/movimientos/MovimientoForm'

import { formatoMoneda } from '../utils/formato'

function MovimientosPage() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const { movimientos, loading, error, crearMovimiento, eliminarMovimiento, verComprobante } =
    useMovimientos()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Movimientos</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="bg-emerald-700 text-white rounded-full px-4 py-2 text-sm font-medium"
        >
          + Registrar
        </button>
      </div>

      {mostrarForm && (
        <MovimientoForm
          onCreate={async (input, archivo) => {
            const resultado = await crearMovimiento(input, archivo)
            if (!resultado) setMostrarForm(false)
            return resultado
          }}
          onCancel={() => setMostrarForm(false)}
        />
      )}

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col gap-3">
        {movimientos.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-sm font-medium">{m.nota || m.categorias?.nombre || 'Movimiento'}</p>
              <p className="text-xs text-gray-400">
                {m.cuentas?.nombre} · {m.categorias?.nombre ?? 'Sin categoría'} · {m.fecha}
              </p>
              {m.comprobante_url && (
                <button
                  onClick={() => verComprobante(m.comprobante_url!)}
                  className="text-emerald-700 text-xs font-medium underline"
                >
                  Ver comprobante
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`tabular-nums text-sm font-medium ${
                  m.tipo === 'ingreso' ? 'text-emerald-700' : 'text-red-500'
                }`}
              >
                {m.tipo === 'ingreso' ? '+' : '-'}
                {formatoMoneda.format(m.monto)}
              </span>
              <button
                onClick={() => eliminarMovimiento(m.id)}
                className="text-red-400 text-xs font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && movimientos.length === 0 && (
        <p className="text-gray-400 text-sm">Todavía no tienes movimientos registrados.</p>
      )}
    </div>
  )
}

export default MovimientosPage