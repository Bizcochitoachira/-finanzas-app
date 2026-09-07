import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError('Correo o contraseña incorrectos.')
      return
    }

    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <label className="block text-sm mb-1">Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
        />

        <label className="block text-sm mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
        />

        <Link to="/olvide-password" className="text-emerald-700 text-xs font-medium block mb-4">
          ¿Olvidaste tu contraseña?
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 text-white rounded-full py-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>

        <p className="text-sm text-center mt-4">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-emerald-700 font-medium">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage