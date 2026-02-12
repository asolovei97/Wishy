import { createContext, useContext } from "react";
import { IModalContext } from "./types";

export const modalContext = createContext<IModalContext | null>(null);

export const useModalContext = () => {
  const context = useContext(modalContext);

  if (!context) {
    throw new Error("Modal Context MUST be used within Modal Context Provider");
  }

  return context;
};
