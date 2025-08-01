import api from './api';

export const categoriasService = {
  // Obtener todas las categorías
  getAll: async () => {
    const res = await api.get('/categorias');
    return res.data;
  },

  // Obtener una categoría por id
  getById: async (id) => {
    const res = await api.get(`/categorias/${id}`);
    return res.data;
  },

  // Crear una categoría
  create: async (categoria) => {
    // categoria debe tener: user_id (opcional), nombre, tipo, color
    const res = await api.post('/categorias', categoria);
    return res.data;
  },

  // Actualizar una categoría
  update: async (id, categoria) => {
    // categoria puede tener: nombre, tipo, color
    const res = await api.put(`/categorias/${id}`, categoria);
    return res.data;
  },

  // Eliminar una categoría
  delete: async (id) => {
    const res = await api.delete(`/categorias/${id}`);
    return res.data;
  }
};