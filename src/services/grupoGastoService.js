import api from './api';

export const grupoGastoService = {
  // Obtener todos los grupos
  getAll: async () => {
    const res = await api.get('/grupos-gastos');
    return res.data;
  },

  // Obtener un grupo por id
  getById: async (id) => {
    const res = await api.get(`/grupos-gastos/${id}`);
    return res.data;
  },

  // Crear un grupo
  create: async (grupo) => {
    const res = await api.post('/grupos-gastos', grupo);
    return res.data;
  },

  // Actualizar un grupo
  update: async (id, grupo) => {
    const res = await api.put(`/grupos-gastos/${id}`, grupo);
    return res.data;
  },

  // Eliminar un grupo
  delete: async (id) => {
    const res = await api.delete(`/grupos-gastos/${id}`);
    return res.data;
  },

  // Agregar miembro
  addMiembro: async (grupoId, userId) => {
    const res = await api.post(`/grupos-gastos/${grupoId}/miembros`, { user_id: userId });
    return res.data;
  },

  // Eliminar miembro
  removeMiembro: async (grupoId, userId) => {
    const res = await api.delete(`/grupos-gastos/${grupoId}/miembros`, { 
      data: { user_id: userId } 
    });
    return res.data;
  },

  // Agregar gasto compartido
  addGasto: async (grupoId, gasto) => {
    const res = await api.post(`/grupos-gastos/${grupoId}/gastos`, gasto);
    return res.data;
  },

  // Obtener balances
  getBalances: async (grupoId) => {
    const res = await api.get(`/grupos-gastos/${grupoId}/balances`);
    return res.data;
  },

  // Generar pagos
  generarPagos: async (grupoId) => {
    const res = await api.post(`/grupos-gastos/${grupoId}/generar-pagos`);
    return res.data;
  },

  // Marcar pago como completado
  completarPago: async (pagoId) => {
    const res = await api.put(`/pagos-grupos/${pagoId}/completar`);
    return res.data;
  },
};