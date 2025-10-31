import api from './api';

export const aporteGastoService = {
  // Obtener aportes de un gasto
  getAll: async (gastoCompartidoId) => {
    const res = await api.get(`/gastos-compartidos/${gastoCompartidoId}/aportes`);
    return res.data;
  },

  // Obtener un aporte
  getById: async (id) => {
    const res = await api.get(`/aportes/${id}`);
    return res.data;
  },

  // Crear aporte
  create: async (aporte) => {
    const res = await api.post('/aportes', aporte);
    return res.data;
  },

  // Actualizar aporte
  update: async (id, aporte) => {
    const res = await api.put(`/aportes/${id}`, aporte);
    return res.data;
  },

  // Eliminar aporte
  delete: async (id) => {
    const res = await api.delete(`/aportes/${id}`);
    return res.data;
  },

  // Registrar pago
  registrarPago: async (aporteId, monto) => {
    const res = await api.post(`/aportes/${aporteId}/pagar`, { monto });
    return res.data;
  },
};