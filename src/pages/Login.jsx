import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nombre: '',
    turno: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.nombre || !formData.turno) {
      alert('Todos los campos son obligatorios')
      return
    }

    localStorage.setItem('user', JSON.stringify(formData))

    navigate('/panel')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a1a] border border-[#262626] p-8 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-yellow-500 mb-2">
          TABLE TRACK
        </h1>

        <p className="text-gray-400 mb-8">
          Sistema de reservas gastronómicas
        </p>

        <div className="mb-5">
          <label className="block mb-2 text-sm">
            Nombre completo
          </label>

          <input
            type="text"
            name="nombre"
            placeholder="Ingresa tu nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black border border-[#262626] focus:outline-none focus:border-yellow-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm">
            Turno
          </label>

          <select
            name="turno"
            value={formData.turno}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black border border-[#262626] focus:outline-none focus:border-yellow-500"
          >
            <option value="">Selecciona un turno</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 text-black font-bold p-3 rounded-lg"
        >
          Ingresar
        </button>
      </form>
    </div>
  )
}

export default Login