import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function MasPage() {
  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Más</h1>

      <div className="flex flex-col gap-2 mb-8">
        <Link to="/cuentas" className="bg-white rounded-2xl shadow-sm p-4 font-medium block">
          Cuentas
        </Link>
        <Link to="/categorias" className="bg-white rounded-2xl shadow-sm p-4 font-medium block">
          Categorías
        </Link>
        <Link to="/transferencias" className="bg-white rounded-2xl shadow-sm p-4 font-medium block">
          Transferencias
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-50 text-red-600 rounded-full px-4 py-2 font-medium"
      >
        Cerrar sesión
      </button>
    </div>
  )
}

export default MasPage