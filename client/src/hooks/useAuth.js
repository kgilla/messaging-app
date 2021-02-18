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
      const response = await fetch("/api/users/logout", {
        method: "post",
      });
      if (!response.ok) {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const signup = async (values) => {
    try {
      const { username, email, password } = values;
      const response = await fetch("/api/users/", {
        method: "post",
        body: JSON.stringify({ username, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      }
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
