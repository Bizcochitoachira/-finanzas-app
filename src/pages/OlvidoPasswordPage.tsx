import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function OlvidoPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/restablecer-password`,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setEnviado(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Recuperar contraseña</h1>

        {enviado ? (
          <p className="text-emerald-700 text-sm text-center">
            Si ese correo tiene una cuenta registrada, te enviamos un enlace para crear una
            contraseña nueva. Revisa tu bandeja de entrada (y spam).
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

            <label className="block text-sm mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 text-white rounded-full py-2 font-medium disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}

        <Link to="/login" className="text-gray-400 text-sm text-center block mt-4">
          ← Volver a iniciar sesión
        </Link>
      </div>
    </div>
  )
}

export default OlvidoPasswordPage