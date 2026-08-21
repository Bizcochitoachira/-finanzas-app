import { Outlet, NavLink } from 'react-router-dom'

function AppLayout() {
  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center text-xs ${isActive ? 'text-emerald-700 font-medium' : 'text-gray-400'}`

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <main className="flex-1 p-4 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2">
        <NavLink to="/" className={linkStyle}>
          Inicio
        </NavLink>
        <NavLink to="/movimientos" className={linkStyle}>
          Movimientos
        </NavLink>
        <NavLink to="/presupuestos" className={linkStyle}>
          Metas
        </NavLink>
        <NavLink to="/mas" className={linkStyle}>
          Más
        </NavLink>
      </nav>
    </div>
  )
}

export default AppLayout