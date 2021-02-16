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

  useEffect(() => {
    const reAuth = async () => {
      try {
        const response = await fetch("/api/users/reAuth", {
          method: "get",
        });
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.log(err);
      }
    };
    reAuth();
  }, []);

  const login = async (values) => {
    try {
      const response = await fetch("/api/users/login", {
        method: "post",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      }
      return data;
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
      const response = await fetch("/api/users/create", {
        method: "post",
        body: JSON.stringify({ username, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setUser(data.user);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    user,
    signup,
    login,
    logout,
  };
}
