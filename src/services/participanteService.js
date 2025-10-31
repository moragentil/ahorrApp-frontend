import api from './api';

export const participanteService = {
  // Obtener participantes de un grupo
  getAll: async (grupoId) => {
    const res = await api.get(`/grupos-gastos/${grupoId}/participantes`);
    return res.data;
  },

  // Obtener un participante
  getById: async (id) => {
    const res = await api.get(`/participantes/${id}`);
    return res.data;
  },

  // Crear participante
  create: async (participante) => {
    const res = await api.post('/participantes', participante);
    return res.data;
  },

  // Actualizar participante
  update: async (id, participante) => {
    const res = await api.put(`/participantes/${id}`, participante);
    return res.data;
  },

  // Eliminar participante
  delete: async (id) => {
    const res = await api.delete(`/participantes/${id}`);
    return res.data;
  },

  // Vincular usuario
  vincularUsuario: async (participanteId, userId) => {
    const res = await api.post(`/participantes/${participanteId}/vincular`, { user_id: userId });
    return res.data;
  },
};