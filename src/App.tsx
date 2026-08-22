import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './features/auth/AuthContext'
import AppLayout from './layouts/AppLayout'
import InicioPage from './pages/InicioPage'
import MovimientosPage from './pages/MovimientosPage'
import PresupuestosPage from './pages/PresupuestosPage'
import MasPage from './pages/MasPage'
import CuentasPage from './pages/CuentasPage'
import CategoriasPage from './pages/CategoriasPage'
import TransferenciasPage from './pages/TransferenciasPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return <p className="p-6 text-center">Cargando...</p>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<SignupPage />} />

        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<InicioPage />} />
          <Route path="/movimientos" element={<MovimientosPage />} />
          <Route path="/presupuestos" element={<PresupuestosPage />} />
          <Route path="/mas" element={<MasPage />} />
          <Route path="/cuentas" element={<CuentasPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/transferencias" element={<TransferenciasPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App