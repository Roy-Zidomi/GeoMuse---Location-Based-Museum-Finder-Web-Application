import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Admin State
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('admin_token'));
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin_info');
    return stored ? JSON.parse(stored) : null;
  });

  // User State
  const [userToken, setUserToken] = useState(() => localStorage.getItem('user_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user_info');
    return stored ? JSON.parse(stored) : null;
  });

  const isAdminAuthenticated = !!adminToken;
  const isUserAuthenticated = !!userToken;

  const adminLogin = (tokenValue, adminInfo) => {
    localStorage.setItem('admin_token', tokenValue);
    localStorage.setItem('admin_info', JSON.stringify(adminInfo));
    setAdminToken(tokenValue);
    setAdmin(adminInfo);
  };

  const adminLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    setAdminToken(null);
    setAdmin(null);
  };

  const userLogin = (tokenValue, userInfo) => {
    localStorage.setItem('user_token', tokenValue);
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    setUserToken(tokenValue);
    setUser(userInfo);
  };

  const userLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      adminToken, admin, isAdminAuthenticated, adminLogin, adminLogout,
      userToken, user, isUserAuthenticated, userLogin, userLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
