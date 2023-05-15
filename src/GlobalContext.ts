import { createContext } from "react";
import { AuthValue } from "./hooks/useAuth";

export type GlobalContext = {
  auth: AuthValue | undefined | "not_initial";
  setAuth: (auth: AuthValue | undefined) => void;
};

export default createContext<GlobalContext>({} as GlobalContext);
