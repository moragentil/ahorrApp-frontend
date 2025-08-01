import api from './api';

export const gastosService = {
  // Obtener todos los gastos
  getAll: async () => {
    const res = await api.get('/gastos');
    return res.data;
  },

  // Obtener un gasto por id
  getById: async (id) => {
    const res = await api.get(`/gastos/${id}`);
    return res.data;
  },

  // Crear un gasto
  create: async (gasto) => {
    // gasto debe tener: user_id, categoria_id, descripcion, monto, fecha
    const res = await api.post('/gastos', gasto);
    return res.data;
  },

  // Actualizar un gasto
  update: async (id, gasto) => {
    // gasto puede tener: categoria_id, descripcion, monto, fecha
    const res = await api.put(`/gastos/${id}`, gasto);
    return res.data;
  },

  // Eliminar un gasto
  delete: async (id) => {
    const res = await api.delete(`/gastos/${id}`);
    return res.data;
  }
};