import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('isra_admin_token');
    const saved = localStorage.getItem('isra_admin');
    if (token && saved) setAdmin(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = (token, adminData) => {
    localStorage.setItem('isra_admin_token', token);
    localStorage.setItem('isra_admin', JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('isra_admin_token');
    localStorage.removeItem('isra_admin');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
