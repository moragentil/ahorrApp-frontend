import api from './api';

export const dashboardService = {
  getHomeData: async ({ month, year } = {}) => {
    const params = {};
    if (month !== undefined) params.month = month + 1; // JS months 0-indexed, backend 1-indexed
    if (year !== undefined) params.year = year;
    const res = await api.get('/dashboard', { params });
    return res.data;
  }
};