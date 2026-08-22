import { Link } from 'react-router-dom'
import { useDashboard } from '../features/dashboard/useDashboard'
import { formatoMoneda } from '../utils/formato'

function InicioPage() {
  const {
    balanceTotal,
    ingresosMes,
    gastosMes,
    gastosPorCategoria,
    ultimosMovimientos,
    loading,
    error,
  } = useDashboard()

  if (loading) return <p>Cargando...</p>
  if (error) return <p className="text-red-600">{error}</p>

  const maxGasto = Math.max(...gastosPorCategoria.map((g) => g.monto), 1)

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
        <p className="text-sm text-gray-500 mb-1">Balance total</p>
        <p className="text-3xl font-bold tabular-nums">{formatoMoneda.format(balanceTotal)}</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-white rounded-2xl shadow-sm p-3">
          <p className="text-xs text-gray-500 mb-1">Ingresos mes</p>
          <p className="text-base font-medium text-emerald-700 tabular-nums">
            +{formatoMoneda.format(ingresosMes)}
          </p>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-sm p-3">
          <p className="text-xs text-gray-500 mb-1">Gastos mes</p>
          <p className="text-base font-medium text-red-500 tabular-nums">
            -{formatoMoneda.format(gastosMes)}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Gastos por categoría</h2>
      {gastosPorCategoria.length === 0 && (
        <p className="text-gray-400 text-sm mb-6">Todavía no tienes gastos este mes.</p>
      )}
      <div className="flex flex-col gap-2 mb-6">
        {gastosPorCategoria.map((g) => (
          <div key={g.nombre} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-24 truncate">{g.nombre}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-700 h-full rounded-full"
                style={{ width: `${(g.monto / maxGasto) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 tabular-nums">
              {formatoMoneda.format(g.monto)}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3">Últimos movimientos</h2>
      <div className="flex flex-col gap-2 mb-4">
        {ultimosMovimientos.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl shadow-sm p-3 flex justify-between items-center"
          >
            <div>
              <p className="text-sm">{m.nota || m.categorias?.nombre || 'Movimiento'}</p>
              <p className="text-xs text-gray-400">{m.cuentas?.nombre}</p>
            </div>
            <span
              className={`tabular-nums text-sm font-medium ${
                m.tipo === 'ingreso' ? 'text-emerald-700' : 'text-red-500'
              }`}
            >
              {m.tipo === 'ingreso' ? '+' : '-'}
              {formatoMoneda.format(m.monto)}
            </span>
          </div>
        ))}
      </div>

      {ultimosMovimientos.length === 0 && (
        <p className="text-gray-400 text-sm">Todavía no tienes movimientos.</p>
      )}

      <Link to="/movimientos" className="text-emerald-700 text-sm font-medium">
        Ver todos los movimientos →
      </Link>
    </div>
  )
}

export default InicioPage