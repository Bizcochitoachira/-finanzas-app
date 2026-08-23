import { useState } from 'react'
import { useDeudas } from '../features/deudas/useDeudas'
import DeudaForm from '../features/deudas/DeudaForm'
import PagoDeudaForm from '../features/deudas/PagoDeudaForm'
import { formatoMoneda } from '../utils/formato'

function DeudasPage() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [pagandoA, setPagandoA] = useState<string | null>(null)
  const { deudas, loading, error, crearDeuda, eliminarDeuda, crearPago } = useDeudas()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Deudas</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="bg-emerald-700 text-white rounded-full px-4 py-2 text-sm font-medium"
        >
          + Registrar
        </button>
      </div>

      {mostrarForm && (
        <DeudaForm
          onCreate={async (acreedor, monto, tasa) => {
            const resultado = await crearDeuda(acreedor, monto, tasa)
            if (!resultado) setMostrarForm(false)
            return resultado
          }}
          onCancel={() => setMostrarForm(false)}
        />
      )}

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col gap-3">
        {deudas.map((d) => {
          const saldoPendiente = Math.max(d.monto - d.pagado, 0)
          return (
            <div key={d.id} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">{d.acreedor}</span>
                <button
                  onClick={() => eliminarDeuda(d.id)}
                  className="text-red-400 text-xs font-medium"
                >
                  Eliminar
                </button>
              </div>
              <p className="text-xs text-gray-500 tabular-nums mb-1">
                Pendiente: {formatoMoneda.format(saldoPendiente)} de {formatoMoneda.format(d.monto)}
              </p>
              {d.tasa_interes && (
                <p className="text-xs text-gray-400 mb-2">Interés: {d.tasa_interes}%</p>
              )}

              {pagandoA === d.id ? (
                <PagoDeudaForm
                  onPagar={async (cuentaId, monto, fecha) => {
                    const resultado = await crearPago(d.id, cuentaId, monto, fecha)
                    if (!resultado) setPagandoA(null)
                    return resultado
                  }}
                  onCancel={() => setPagandoA(null)}
                />
              ) : (
                saldoPendiente > 0 && (
                  <button
                    onClick={() => setPagandoA(d.id)}
                    className="text-emerald-700 text-xs font-medium"
                  >
                    + Registrar pago
                  </button>
                )
              )}
            </div>
          )
        })}
      </div>

      {!loading && deudas.length === 0 && (
        <p className="text-gray-400 text-sm">Todavía no tienes deudas registradas.</p>
      )}
    </div>
  )
}

export default DeudasPage