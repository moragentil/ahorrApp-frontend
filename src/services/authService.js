import api from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const res = await api.post('/login', { email, password });
      const { access_token, token_type } = res.data;
      // Guarda el token en localStorage
      localStorage.setItem('token', access_token);
      // Cambia '/user' por '/me'
      const userRes = await api.get('/me', { headers: { Authorization: `${token_type} ${access_token}` } });
      localStorage.setItem('user', JSON.stringify(userRes.data));
      return { success: true, token: access_token };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Error de autenticación' };
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await api.post('/register', { name, email, password });
      const { access_token, token_type, user } = res.data;
      
      // Guardar token en localStorage
      localStorage.setItem('token', access_token);
      
      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Error al registrar' };
    }
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await api.post('/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  updateProfile: async (data) => {
    const res = await api.put('/profile', data);
    // Actualiza el usuario en localStorage
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  },
};