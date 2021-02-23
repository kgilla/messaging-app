import React, { useState, useContext, createContext } from "react";

const snackContext = createContext();

export function ProvideSnack({ children }) {
  const snack = useProvideSnack();
  return (
    <snackContext.Provider value={snack}>{children}</snackContext.Provider>
  );
}

export const useSnack = () => {
  return useContext(snackContext);
};

function useProvideSnack() {
  const [snack, setSnack] = useState(null);

  // Creates a Snack component for errors or success messages
  const createSnack = (data) => {
    const { message, severity } = data;
    setSnack({ message, severity });
  };

  return {
    snack,
    createSnack,
  };
}
