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

  const login = async (values) => {
    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "post",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return true;
      } else {
        const data = await response.json();
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (values) => {
    try {
      const { username, email, password } = values;
      const response = await fetch("http://localhost:3001/api/users/create", {
        method: "post",
        body: JSON.stringify({ username, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return data;
      } else {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      console.log(err);
    }
  };

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
    signup,
    login,
    logout,
  };
}
