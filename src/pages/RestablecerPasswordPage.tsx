import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function RestablecerPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear nueva contraseña</h1>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <label className="block text-sm mb-1">Nueva contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
        />

        <label className="block text-sm mb-1">Confirmar contraseña</label>
        <input
          type="password"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 text-white rounded-full py-2 font-medium disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
        </button>
      </form>
    </div>
  )
}

export default RestablecerPasswordPage