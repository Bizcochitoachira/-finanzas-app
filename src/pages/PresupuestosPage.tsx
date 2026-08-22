import { useState } from 'react'
import { usePresupuestos } from '../features/presupuestos/usePresupuestos'
import PresupuestoForm from '../features/presupuestos/PresupuestoForm'
import { formatoMoneda } from '../utils/formato'

function PresupuestosPage() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const { presupuestos, loading, error, crearPresupuesto, eliminarPresupuesto } = usePresupuestos()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Presupuestos</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="bg-emerald-700 text-white rounded-full px-4 py-2 text-sm font-medium"
        >
          + Crear
        </button>
      </div>

      {mostrarForm && (
        <PresupuestoForm
          onCreate={async (categoriaId, monto, periodo) => {
            const resultado = await crearPresupuesto(categoriaId, monto, periodo)
            if (!resultado) setMostrarForm(false)
            return resultado
          }}
          onCancel={() => setMostrarForm(false)}
        />
      )}

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col gap-3">
        {presupuestos.map((p) => {
          const porcentaje = Math.min((p.gastado / p.monto_limite) * 100, 100)
          const cercaOsuperado = p.gastado / p.monto_limite >= 0.9

          return (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">{p.nombreCategoria}</span>
                <button
                  onClick={() => eliminarPresupuesto(p.id)}
                  className="text-red-400 text-xs font-medium"
                >
                  Eliminar
                </button>
              </div>
              <div className="bg-gray-100 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${cercaOsuperado ? 'bg-amber-500' : 'bg-emerald-700'}`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 tabular-nums">
                {formatoMoneda.format(p.gastado)} / {formatoMoneda.format(p.monto_limite)} ·{' '}
                {p.periodo}
              </p>
              {cercaOsuperado && (
                <p className="text-xs text-amber-600 font-medium mt-1">⚠ Cerca del límite</p>
              )}
            </div>
          )
        })}
      </div>

      {!loading && presupuestos.length === 0 && (
        <p className="text-gray-400 text-sm">Todavía no tienes presupuestos.</p>
      )}
    </div>
  )
}

export default PresupuestosPage