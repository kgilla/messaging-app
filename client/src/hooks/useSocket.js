import React, { useState, useEffect, useContext, createContext } from "react";
import { io } from "socket.io-client";
import { useAuth } from "hooks/useAuth";

const socketContext = createContext();

export function ProvideSocket({ children }) {
  const socket = useProvideSocket();
  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
}

export const useSocket = () => {
  return useContext(socketContext);
};

function useProvideSocket() {
  const [socket, setSocket] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    const connection = io("http://localhost:3001");

    setSocket(connection);

    connection.on("connect", () => {
      console.log("connected!");
    });
  }, [auth.user]);

  return { socket };
}
