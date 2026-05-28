import axios from 'axios'

// ESTA es tu URL correcta de MockAPI
const API_URL = 'https://6a17a14a1878294b597bae94.mockapi.io/reservas'

// OBTENER reservas (GET)
export const getReservas = () => axios.get(API_URL)

// CREAR reserva (POST)
export const createReserva = (data) => axios.post(API_URL, data)

// EDITAR reserva (PUT)
export const updateReserva = (id, data) =>
  axios.put(`${API_URL}/${id}`, data)

// ELIMINAR reserva (DELETE)
export const deleteReserva = (id) =>
  axios.delete(`${API_URL}/${id}`)