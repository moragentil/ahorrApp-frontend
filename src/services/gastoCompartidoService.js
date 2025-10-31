import api from './api';

export const gastoCompartidoService = {
  // Obtener gastos de un grupo
  getAll: async (grupoId) => {
    const res = await api.get(`/grupos-gastos/${grupoId}/gastos-compartidos`);
    return res.data;
  },

  // Obtener un gasto
  getById: async (id) => {
    const res = await api.get(`/gastos-compartidos/${id}`);
    return res.data;
  },

  // Crear gasto compartido
  create: async (gasto) => {
    const res = await api.post('/gastos-compartidos', gasto);
    return res.data;
  },

  // Actualizar gasto
  update: async (id, gasto) => {
    const res = await api.put(`/gastos-compartidos/${id}`, gasto);
    return res.data;
  },

  // Eliminar gasto
  delete: async (id) => {
    const res = await api.delete(`/gastos-compartidos/${id}`);
    return res.data;
  },

  // Registrar aportes
  registrarAportes: async (gastoId, aportes) => {
    const res = await api.post(`/gastos-compartidos/${gastoId}/aportes`, { aportes });
    return res.data;
  },
};