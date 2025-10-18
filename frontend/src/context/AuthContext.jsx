import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // useEffect(() => {
  //   if (token) {
  //     // In a real app, you'd verify the token with your backend here
  //     // and fetch user data. For now, we'll just set a mock user.
  //     setUser({ name: 'Admin User' });
  //   }
  //   setLoading(false);
  // }, [token]);

  // const login = (userData, authToken) => {
  //   localStorage.setItem('accessToken', authToken);
  //   setToken(authToken);
  //   setUser(userData);
  // };

  // const logout = () => {
  //   localStorage.removeItem('accessToken');
  //   setToken(null);
  //   setUser(null);
  // };

  // const value = useMemo(() => ({
  //   user,
  //   token,
  //   isLoggedIn: !!token,
  //   loading,
  //   login,
  //   logout,
  // }), [user, token, loading]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
