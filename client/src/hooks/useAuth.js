import React, { useState, useEffect, useContext, createContext } from "react";
import Loading from "components/Loading";
import { connectSocket, socket } from "./useSocket";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return auth.isLoading ? (
    <Loading />
  ) : (
    <authContext.Provider value={auth}>{children}</authContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const reAuth = async () => {
      try {
        const response = await fetch("/api/users/reAuth", {
          method: "get",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            connectSocket(data.user);
            setUser(data.user);
          }
        }
        setIsLoading(false);
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
        connectSocket(data.user);
        setUser(data.user);
      }
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      socket.disconnect();
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
        connectSocket(data.user);
        setUser(data.user);
      }
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    user,
    isLoading,
    signup,
    login,
    logout,
  };
}
