import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './features/auth/AuthContext'
import { SettingsProvider } from './features/configuracion/SettingsContext'
import { ToastProvider } from './features/notificaciones/ToastContext'
import AppLayout from './layouts/AppLayout'
import InicioPage from './pages/InicioPage'
import MovimientosPage from './pages/MovimientosPage'
import PresupuestosPage from './pages/PresupuestosPage'
import MetasPage from './pages/MetasPage'
import MasPage from './pages/MasPage'
import CuentasPage from './pages/CuentasPage'
import CategoriasPage from './pages/CategoriasPage'
import TransferenciasPage from './pages/TransferenciasPage'
import DeudasPage from './pages/DeudasPage'
import PrestamosPage from './pages/PrestamosPage'
import ReportesPage from './pages/ReportesPage'
import ConfiguracionPage from './pages/ConfiguracionPage'
import RespaldoPage from './pages/RespaldoPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OlvidoPasswordPage from './pages/OlvidoPasswordPage'
import RestablecerPasswordPage from './pages/RestablecerPasswordPage'

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
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<SignupPage />} />
          <Route path="/olvide-password" element={<OlvidoPasswordPage />} />
          <Route path="/restablecer-password" element={<RestablecerPasswordPage />} />

          <Route
            element={
              <RequireAuth>
                <SettingsProvider>
                  <AppLayout />
                </SettingsProvider>
              </RequireAuth>
            }
          >
            <Route path="/" element={<InicioPage />} />
            <Route path="/movimientos" element={<MovimientosPage />} />
            <Route path="/presupuestos" element={<PresupuestosPage />} />
            <Route path="/metas" element={<MetasPage />} />
            <Route path="/mas" element={<MasPage />} />
            <Route path="/cuentas" element={<CuentasPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/transferencias" element={<TransferenciasPage />} />
            <Route path="/deudas" element={<DeudasPage />} />
            <Route path="/prestamos" element={<PrestamosPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
            <Route path="/respaldo" element={<RespaldoPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App