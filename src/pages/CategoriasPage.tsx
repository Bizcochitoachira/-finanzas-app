import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCategorias } from '../features/categorias/useCategorias'
import CategoriaForm from '../features/categorias/CategoriaForm'

function CategoriasPage() {
  const [verInactivas, setVerInactivas] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)
  const { categorias, loading, error, crearCategoria, cambiarActiva, eliminarCategoria } =
    useCategorias(verInactivas)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {verInactivas ? 'Categorías inactivas' : 'Mis categorías'}
        </h1>
        {!verInactivas && (
          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="bg-emerald-700 text-white rounded-full px-4 py-2 text-sm font-medium"
          >
            + Crear
          </button>
        )}
      </div>

      {mostrarForm && (
        <CategoriaForm
          onCreate={async (nombre, tipo) => {
            const resultado = await crearCategoria(nombre, tipo)
            if (!resultado) setMostrarForm(false)
            return resultado
          }}
          onCancel={() => setMostrarForm(false)}
        />
      )}

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col gap-3">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className="bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center"
          >
            <div>
              <span>{categoria.nombre}</span>
              <span className="text-xs text-gray-400 ml-2">
                {categoria.tipo === 'gasto' ? 'Gasto' : 'Ingreso'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {verInactivas ? (
                <button
                  onClick={() => cambiarActiva(categoria.id, true)}
                  className="text-emerald-700 text-sm font-medium"
                >
                  Activar
                </button>
              ) : (
                <button
                  onClick={() => cambiarActiva(categoria.id, false)}
                  className="text-gray-400 text-sm font-medium"
                >
                  Desactivar
                </button>
              )}
              <button
                onClick={() => eliminarCategoria(categoria.id)}
                className="text-red-500 text-sm font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && categorias.length === 0 && (
        <p className="text-gray-400 text-sm">
          {verInactivas ? 'No tienes categorías inactivas.' : 'Todavía no tienes categorías.'}
        </p>
      )}

      <button
        onClick={() => setVerInactivas((v) => !v)}
        className="text-emerald-700 text-sm font-medium mt-6 block"
      >
        {verInactivas ? '← Ver categorías activas' : 'Ver categorías inactivas'}
      </button>

      <Link to="/mas" className="text-gray-400 text-sm mt-4 block">
        ← Volver a Más
      </Link>
    </div>
  )
}

export default CategoriasPage