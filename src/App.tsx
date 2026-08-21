import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import InicioPage from './pages/InicioPage'
import MovimientosPage from './pages/MovimientosPage'
import PresupuestosPage from './pages/PresupuestosPage'
import MasPage from './pages/MasPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<InicioPage />} />
        <Route path="/movimientos" element={<MovimientosPage />} />
        <Route path="/presupuestos" element={<PresupuestosPage />} />
        <Route path="/mas" element={<MasPage />} />
      </Route>
    </Routes>
  )
}

export default App