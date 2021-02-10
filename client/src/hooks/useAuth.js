import React, { useState, useEffect, useContext, createContext } from "react";
const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState({});

  const login = () => {};

  const logout = () => {};

  const signup = () => {};

  useEffect(() => {
    const unsubscribe = (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    };

    return () => unsubscribe();
  }, []);

  return {
    user,
    login,
    logout,
  };
}
