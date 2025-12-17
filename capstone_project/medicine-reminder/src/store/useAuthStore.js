import { create } from 'zustand';

const useAuthStore = create((set) => ({
  access: localStorage.getItem('access') || null,
  refresh: localStorage.getItem('refresh') || null,
  email: localStorage.getItem('email') || null,
  setAuth: (access, refresh, email) => {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    localStorage.setItem('email', email || '');
    set({ access, refresh, email });
  },
  clearAuth: () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('email');
    set({ access: null, refresh: null, email: null });
  },
}));

export default useAuthStore;

