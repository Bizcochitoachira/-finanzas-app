import { Link } from 'react-router-dom'
import { useSettings } from '../features/configuracion/SettingsContext'

const MONEDAS = [
  { value: 'COP', label: 'Peso colombiano (COP)' },
  { value: 'USD', label: 'Dólar estadounidense (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'MXN', label: 'Peso mexicano (MXN)' },
]

function ConfiguracionPage() {
  const { moneda, cambiarMoneda } = useSettings()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <label className="block text-sm mb-1">Moneda</label>
        <select
          value={moneda}
          onChange={(e) => cambiarMoneda(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          {MONEDAS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <Link to="/respaldo" className="bg-white rounded-2xl shadow-sm p-4 font-medium block">
        Respaldo de datos
      </Link>
    </div>
  )
}

export default ConfiguracionPage