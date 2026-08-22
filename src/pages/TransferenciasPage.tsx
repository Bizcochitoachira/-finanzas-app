import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransferencias } from '../features/transferencias/useTransferencias'
import TransferenciaForm from '../features/transferencias/TransferenciaForm'
import { formatoMoneda } from '../utils/formato'

function TransferenciasPage() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const { transferencias, loading, error, crearTransferencia } = useTransferencias()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transferencias</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="bg-emerald-700 text-white rounded-full px-4 py-2 text-sm font-medium"
        >
          + Transferir
        </button>
      </div>

      {mostrarForm && (
        <TransferenciaForm
          onCreate={async (origenId, destinoId, monto, fecha) => {
            const resultado = await crearTransferencia(origenId, destinoId, monto, fecha)
            if (!resultado) setMostrarForm(false)
            return resultado
          }}
          onCancel={() => setMostrarForm(false)}
        />
      )}

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col gap-3">
        {transferencias.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-sm">
                {t.origen?.nombre} → {t.destino?.nombre}
              </p>
              <p className="text-xs text-gray-400">{t.fecha}</p>
            </div>
            <span className="tabular-nums text-sm font-medium">
              {formatoMoneda.format(t.monto)}
            </span>
          </div>
        ))}
      </div>

      {!loading && transferencias.length === 0 && (
        <p className="text-gray-400 text-sm">Todavía no tienes transferencias.</p>
      )}

      <Link to="/mas" className="text-gray-400 text-sm mt-4 block">
        ← Volver a Más
      </Link>
    </div>
  )
}

export default TransferenciasPage