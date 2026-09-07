import { useReportes } from '../features/reportes/useReportes'
import { formatoMoneda } from '../utils/formato'

function ReportesPage() {
  const { mesActual, mesAnterior, topCategorias, loading, error, exportarCSV } = useReportes()

  if (loading) return <p>Cargando...</p>
  if (error) return <p className="text-red-600">{error}</p>

  const diferenciaGastos = mesActual.gastos - mesAnterior.gastos

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reportes</h1>
        <button
          onClick={exportarCSV}
          className="bg-emerald-700 text-white rounded-full px-4 py-2 text-sm font-medium"
        >
          Exportar CSV
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-3">Mes actual vs. mes anterior</h2>
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Ingresos</span>
        </div>
        <div className="flex justify-between mb-4 text-sm tabular-nums">
          <span>Este mes: {formatoMoneda.format(mesActual.ingresos)}</span>
          <span className="text-gray-400">
            Mes anterior: {formatoMoneda.format(mesAnterior.ingresos)}
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Gastos</span>
        </div>
        <div className="flex justify-between text-sm tabular-nums">
          <span>Este mes: {formatoMoneda.format(mesActual.gastos)}</span>
          <span className="text-gray-400">
            Mes anterior: {formatoMoneda.format(mesAnterior.gastos)}
          </span>
        </div>

        <p
          className={`text-xs font-medium mt-3 ${
            diferenciaGastos > 0 ? 'text-red-500' : 'text-emerald-700'
          }`}
        >
          {diferenciaGastos > 0
            ? `Gastaste ${formatoMoneda.format(diferenciaGastos)} más que el mes pasado.`
            : `Gastaste ${formatoMoneda.format(Math.abs(diferenciaGastos))} menos que el mes pasado.`}
        </p>
      </div>

      <h2 className="text-lg font-semibold mb-3">Top 5 categorías con más gasto (este mes)</h2>
      <div className="flex flex-col gap-2">
        {topCategorias.map((c, i) => (
          <div
            key={c.nombre}
            className="bg-white rounded-2xl shadow-sm p-3 flex justify-between items-center"
          >
            <span className="text-sm">
              {i + 1}. {c.nombre}
            </span>
            <span className="tabular-nums text-sm font-medium">
              {formatoMoneda.format(c.monto)}
            </span>
          </div>
        ))}
      </div>

      {topCategorias.length === 0 && (
        <p className="text-gray-400 text-sm">Todavía no tienes gastos este mes.</p>
      )}
    </div>
  )
}

export default ReportesPage