const MOCK_USER = {
  email: 'admin@ahorrapp.com',
  password: '123456',
  name: 'Usuario Admin'
};

export const authService = {
  login: async (email, password) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      const userData = { email: MOCK_USER.email, name: MOCK_USER.name };
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    
    return { success: false, error: 'Credenciales incorrectas' };
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};