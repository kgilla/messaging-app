import React, { useState, useEffect, useContext, createContext } from "react";
import { baseUrl } from "../config/const";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const login = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/users/login`, {
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

  const logout = async () => {
    try {
      setUser(null);
      const response = await fetch(`${baseUrl}/users/logout`, {
        method: "post",
      });
      if (response.ok) {
        // TODO issue some logout flash message
      }
    } catch (err) {
      console.log(err);
    }
  };

  const signup = async (values) => {
    try {
      const { username, email, password } = values;
      const response = await fetch(`${baseUrl}/users/create`, {
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
