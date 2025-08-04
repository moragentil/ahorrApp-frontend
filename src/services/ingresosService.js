import api from './api';

export const ingresosService = {
  // Obtener todos los ingresos
  getAll: async () => {
    const res = await api.get('/ingresos');
    return res.data;
  },

  // Obtener un ingreso por id
  getById: async (id) => {
    const res = await api.get(`/ingresos/${id}`);
    return res.data;
  },

  // Crear un ingreso
  create: async (ingreso) => {
    // ingreso debe tener: user_id, categoria_id, descripcion, monto, fecha
    const res = await api.post('/ingresos', ingreso);
    return res.data;
  },

  // Actualizar un ingreso
  update: async (id, ingreso) => {
    // ingreso puede tener: categoria_id, descripcion, monto, fecha
    const res = await api.put(`/ingresos/${id}`, ingreso);
    return res.data;
  },

  // Eliminar un ingreso
  delete: async (id) => {
    const res = await api.delete(`/ingresos/${id}`);
    return res.data;
  },

  // Obtener estadísticas de ingresos (tendencia y distribución por categoría)
  getEstadisticas: async ({ month, year } = {}) => {
    const params = {};
    if (month !== undefined) params.month = month + 1; // JS months 0-indexed, backend 1-indexed
    if (year !== undefined) params.year = year;
    const res = await api.get('/ingresos/estadisticas', { params });
    return res.data;
  }
};