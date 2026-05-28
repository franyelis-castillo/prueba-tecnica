import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import {
  getReservas,
  createReserva,
  updateReserva,
  deleteReserva,
} from '../services/api'

function Panel() {
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  const [editando, setEditando] = useState(null)

  const [form, setForm] = useState({
    nombreCliente: '',
    fechaHora: '',
    cantidadPersonas: '',
    estado: 'En Espera',
  })

  // 📥 TRAER RESERVAS
  const fetchReservas = async () => {
    try {
      const res = await getReservas()
      setReservas(res.data)
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las reservas', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservas()
  }, [])

  // ✍️ INPUTS
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // ➕ CREAR / ✏️ EDITAR
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 🔥 VALIDACIÓN MEJORADA
    if (!form.nombreCliente || !form.fechaHora || !form.cantidadPersonas) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error')
      return
    }

    const personas = Number(form.cantidadPersonas)

    if (personas <= 0) {
      Swal.fire(
        'Error',
        'La cantidad de personas debe ser mayor a 0',
        'error'
      )
      return
    }

    try {
      if (editando) {
        await updateReserva(editando.id, {
          ...form,
          cantidadPersonas: personas,
        })

        Swal.fire('Actualizado', 'Reserva editada correctamente', 'success')
        setEditando(null)
      } else {
        await createReserva({
          ...form,
          cantidadPersonas: personas,
        })

        Swal.fire('Creado', 'Reserva creada correctamente', 'success')
      }

      setForm({
        nombreCliente: '',
        fechaHora: '',
        cantidadPersonas: '',
        estado: 'En Espera',
      })

      fetchReservas()
    } catch (error) {
      Swal.fire('Error', 'Algo salió mal', 'error')
    }
  }

  // ✏️ EDITAR
  const handleEdit = (reserva) => {
    setEditando(reserva)

    setForm({
      nombreCliente: reserva.nombreCliente,
      fechaHora: reserva.fechaHora,
      cantidadPersonas: reserva.cantidadPersonas,
      estado: reserva.estado,
    })
  }

  // ❌ ELIMINAR
  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta reserva se eliminará',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteReserva(id)
        Swal.fire('Eliminado', 'Reserva eliminada', 'success')
        fetchReservas()
      }
    })
  }

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-yellow-500">
            Panel de Reservas
          </h1>

          <p className="text-gray-400 mt-2">
            Host: {user?.nombre}
          </p>

          <p className="text-gray-400">
            Turno: {user?.turno}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-5 py-3 rounded-lg"
        >
          Cerrar sesión
        </button>
      </div>

      {/* FORMULARIO */}
      <div className="bg-[#1a1a1a] border border-[#262626] p-6 rounded-xl mb-8">

        <h2 className="text-yellow-500 font-bold mb-4">
          {editando ? 'Editar reserva' : 'Crear nueva reserva'}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">

          <input
            type="text"
            name="nombreCliente"
            placeholder="Nombre cliente"
            value={form.nombreCliente}
            onChange={handleChange}
            className="p-2 bg-black border border-gray-700 rounded"
          />

          <input
            type="datetime-local"
            name="fechaHora"
            value={form.fechaHora}
            onChange={handleChange}
            className="p-2 bg-black border border-gray-700 rounded"
          />

          <input
            type="number"
            name="cantidadPersonas"
            placeholder="#Personas"
            value={form.cantidadPersonas}
            onChange={handleChange}
            min="1"
            className="p-2 bg-black border border-gray-700 rounded"
          />

          <button
            type="submit"
            className="bg-yellow-500 text-black font-bold rounded"
          >
            {editando ? 'Actualizar' : 'Crear'}
          </button>

        </form>
      </div>

      {/* LISTA */}
      <div className="bg-[#1a1a1a] border border-[#262626] p-6 rounded-xl">

        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : reservas.length === 0 ? (
          <p className="text-gray-400">No hay reservas</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">

            {reservas.map((r) => (
              <div
                key={r.id}
                className="bg-black border border-gray-800 p-4 rounded-xl"
              >
                <h3 className="text-yellow-500 font-bold">
                  {r.nombreCliente}
                </h3>

                <p className="text-gray-400">📅 {r.fechaHora}</p>
                <p className="text-gray-400">👥 {r.cantidadPersonas}</p>

                <span className="text-sm bg-yellow-500 text-black px-2 py-1 rounded">
                  {r.estado}
                </span>

                <div className="flex gap-2 mt-3">

                  <button
                    onClick={() => handleEdit(r)}
                    className="bg-blue-500 px-2 py-1 rounded text-sm"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-500 px-2 py-1 rounded text-sm"
                  >
                    Eliminar
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}

export default Panel