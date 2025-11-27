import api from './api';

export const invitacionGrupoService = {
  // Enviar invitación
  enviarInvitacion: async (grupoId, email) => {
    const res = await api.post(`/grupos-gastos/${grupoId}/invitar`, { email });
    return res.data;
  },

  // Mis invitaciones pendientes
  misInvitaciones: async () => {
    const res = await api.get('/invitaciones');
    return res.data;
  },

  // Aceptar invitación
  aceptar: async (token) => {
    const res = await api.post(`/invitaciones/${token}/aceptar`);
    return res.data;
  },

  // Rechazar invitación
  rechazar: async (token) => {
    const res = await api.post(`/invitaciones/${token}/rechazar`);
    return res.data;
  },

  // Invitaciones pendientes de un grupo
  invitacionesPendientes: async (grupoId) => {
    const res = await api.get(`/grupos-gastos/${grupoId}/invitaciones`);
    return res.data;
  },

  // Cancelar invitación
  cancelar: async (invitacionId) => {
    const res = await api.delete(`/invitaciones/${invitacionId}`);
    return res.data;
  },

  // Generar enlace de invitación
  generarEnlaceInvitacion: async (grupoId) => {
    const response = await api.post(`/grupos-gastos/${grupoId}/generar-enlace-invitacion`);
    return response.data;
  },
};

export default invitacionGrupoService;