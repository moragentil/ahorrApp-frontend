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
    const res = await api.post('/categorias', categoria);
    return res.data;
  },

  // Actualizar una categoría
  update: async (id, categoria) => {
    const res = await api.put(`/categorias/${id}`, categoria);
    return res.data;
  },

  // Eliminar una categoría
  delete: async (id) => {
    const res = await api.delete(`/categorias/${id}`);
    return res.data;
  },

  // Obtener categorías por tipo
  getByTipo: async (tipo) => {
    const res = await api.get(`/categorias/${tipo}`);
    return res.data;
  },

  // Obtener solo categorías de gasto
  getGastoCategorias: async () => {
    const res = await api.get('/categorias/gasto');
    return res.data;
  },

  // Obtener solo categorías de ingreso
  getIngresoCategorias: async () => {
    const res = await api.get('/categorias/ingreso');
    return res.data;
  },

  // Obtener resumen de categorías (total gastado/ingresos y transacciones por categoría)
  getResumen: async () => {
    const res = await api.get('/categorias/resumen');
    return res.data;
  }
};