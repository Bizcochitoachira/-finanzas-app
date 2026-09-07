import { useRespaldo } from '../features/respaldo/useRespaldo'

function RespaldoPage() {
  const { exportarRespaldo, exportando, error } = useRespaldo()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Respaldo de datos</h1>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <h2 className="font-medium mb-2">Descargar respaldo completo</h2>
        <p className="text-sm text-gray-500 mb-4">
          Genera un archivo con toda la información de tu cuenta: cuentas, movimientos,
          categorías, presupuestos, metas, deudas y préstamos.
        </p>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button
          onClick={exportarRespaldo}
          disabled={exportando}
          className="bg-emerald-700 text-white rounded-full px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {exportando ? 'Generando...' : 'Descargar respaldo (.json)'}
        </button>
      </div>
    </div>
  )
}

export default RespaldoPage