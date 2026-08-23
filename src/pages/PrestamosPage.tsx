import { useState } from 'react'
import { usePrestamos } from '../features/prestamos/usePrestamos'
import PrestamoForm from '../features/prestamos/PrestamoForm'
import PagoPrestamoForm from '../features/prestamos/PagoPrestamoForm'
import { formatoMoneda } from '../utils/formato'

function PrestamosPage() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [pagandoA, setPagandoA] = useState<string | null>(null)
  const { prestamos, loading, error, crearPrestamo, eliminarPrestamo, crearPago } = usePrestamos()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Préstamos</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="bg-emerald-700 text-white rounded-full px-4 py-2 text-sm font-medium"
        >
          + Registrar
        </button>
      </div>

      {mostrarForm && (
        <PrestamoForm
          onCreate={async (tipo, persona, monto, cuentaId, fecha) => {
            const resultado = await crearPrestamo(tipo, persona, monto, cuentaId, fecha)
            if (!resultado) setMostrarForm(false)
            return resultado
          }}
          onCancel={() => setMostrarForm(false)}
        />
      )}

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col gap-3">
        {prestamos.map((p) => {
          const saldoPendiente = Math.max(p.monto - p.pagado, 0)
          return (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">
                  {p.persona} · {p.tipo === 'dado' ? 'Le presté' : 'Me prestó'}
                </span>
                <button
                  onClick={() => eliminarPrestamo(p.id)}
                  className="text-red-400 text-xs font-medium"
                >
                  Eliminar
                </button>
              </div>
              <p className="text-xs text-gray-500 tabular-nums mb-2">
                Pendiente: {formatoMoneda.format(saldoPendiente)} de {formatoMoneda.format(p.monto)}
              </p>

              {pagandoA === p.id ? (
                <PagoPrestamoForm
                  etiqueta={
                    p.tipo === 'dado' ? 'A qué cuenta entra el abono' : 'Desde qué cuenta pagas'
                  }
                  onPagar={async (cuentaId, monto, fecha) => {
                    const resultado = await crearPago(p.id, cuentaId, monto, fecha)
                    if (!resultado) setPagandoA(null)
                    return resultado
                  }}
                  onCancel={() => setPagandoA(null)}
                />
              ) : (
                saldoPendiente > 0 && (
                  <button
                    onClick={() => setPagandoA(p.id)}
                    className="text-emerald-700 text-xs font-medium"
                  >
                    {p.tipo === 'dado' ? '+ Registrar abono recibido' : '+ Registrar pago'}
                  </button>
                )
              )}
            </div>
          )
        })}
      </div>

      {!loading && prestamos.length === 0 && (
        <p className="text-gray-400 text-sm">Todavía no tienes préstamos registrados.</p>
      )}
    </div>
  )
}

export default PrestamosPage