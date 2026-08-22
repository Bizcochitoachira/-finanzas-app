import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCuentas } from '../features/cuentas/useCuentas'
import CuentaForm from '../features/cuentas/CuentaForm'

import { formatoMoneda } from '../utils/formato'

function CuentasPage() {
  const [verArchivadas, setVerArchivadas] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)
  const { cuentas, loading, error, crearCuenta, archivarCuenta, eliminarCuenta } =
    useCuentas(verArchivadas)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {verArchivadas ? 'Cuentas archivadas' : 'Mis cuentas'}
        </h1>
        {!verArchivadas && (
          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="bg-emerald-700 text-white rounded-full px-4 py-2 text-sm font-medium"
          >
            + Crear
          </button>
        )}
      </div>

      {mostrarForm && (
        <CuentaForm
          onCreate={async (nombre, tipo, saldoInicial) => {
            const resultado = await crearCuenta(nombre, tipo, saldoInicial)
            if (!resultado) setMostrarForm(false)
            return resultado
          }}
          onCancel={() => setMostrarForm(false)}
        />
      )}

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col gap-3">
        {cuentas.map((cuenta) => (
          <div
            key={cuenta.id}
            className="bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center"
          >
            <span>{cuenta.nombre}</span>
            <div className="flex items-center gap-3">
              <span className="tabular-nums">{formatoMoneda.format(cuenta.saldo)}</span>
              {verArchivadas ? (
                <button
                  onClick={() => archivarCuenta(cuenta.id, false)}
                  className="text-emerald-700 text-sm font-medium"
                >
                  Desarchivar
                </button>
              ) : (
                <button
                  onClick={() => archivarCuenta(cuenta.id, true)}
                  className="text-gray-400 text-sm font-medium"
                >
                  Archivar
                </button>
              )}
              <button
                onClick={() => eliminarCuenta(cuenta.id)}
                className="text-red-500 text-sm font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && cuentas.length === 0 && (
        <p className="text-gray-400 text-sm">
          {verArchivadas ? 'No tienes cuentas archivadas.' : 'Todavía no tienes cuentas.'}
        </p>
      )}

      <button
        onClick={() => setVerArchivadas((v) => !v)}
        className="text-emerald-700 text-sm font-medium mt-6 block"
      >
        {verArchivadas ? '← Ver cuentas activas' : 'Ver cuentas archivadas'}
      </button>

      <Link to="/mas" className="text-gray-400 text-sm mt-4 block">
        ← Volver a Más
      </Link>
    </div>
  )
}

export default CuentasPage