import api from './api';

export const ahorroService = {
  // Obtener todos los ahorros
  getAll: async () => {
    const res = await api.get('/ahorros');
    return res.data;
  },

  // Obtener un ahorro por id
  getById: async (id) => {
    const res = await api.get(`/ahorros/${id}`);
    return res.data;
  },

  // Crear un ahorro
  create: async (ahorro) => {
    // ahorro debe tener: user_id, nombre, descripcion, monto_objetivo, monto_actual, fecha_limite, prioridad, estado
    const res = await api.post('/ahorros', ahorro);
    return res.data;
  },

  // Actualizar un ahorro
  update: async (id, ahorro) => {
    const res = await api.put(`/ahorros/${id}`, ahorro);
    return res.data;
  },

  // Eliminar un ahorro
  delete: async (id) => {
    const res = await api.delete(`/ahorros/${id}`);
    return res.data;
  }
};