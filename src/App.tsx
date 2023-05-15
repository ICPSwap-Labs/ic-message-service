import Sidebar from "./components/Sidebar";
import { Box } from "@mui/material";
import Routes from "./router";
import Connector from "./components/Connector";
import {
  useInitialConnector,
  useInitialAuth,
  AuthValue,
  setLocalAuth,
} from "./hooks/useAuth";
import LinearProgress from "@mui/material/LinearProgress";
import Header from "./components/Header";
import Auth, { AuthProps } from "./components/Auth";
import GlobalContext from "./GlobalContext";
import { useCallback, useState } from "react";

export function LinearIndeterminate() {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}

function Main({ auth }: { auth: AuthValue | "not_initial" | undefined }) {
  const { loading } = useInitialConnector();

  useInitialAuth();

  return loading || auth === "not_initial" ? (
    <LinearIndeterminate></LinearIndeterminate>
  ) : !!auth?.principal ? (
    <Auth>
      {({ role }: AuthProps) => (
        <Box sx={{ display: "flex" }}>
          <Sidebar role={role}></Sidebar>
          <Box sx={{ padding: "20px", width: "100%" }}>
            <Box sx={{ margin: "0 0 20px 0" }}>
              <Header></Header>
            </Box>
            <Routes role={role}></Routes>
          </Box>
        </Box>
      )}
    </Auth>
  ) : (
    <Connector></Connector>
  );
}

export default function App() {
  const [auth, setAuth] = useState<AuthValue | "not_initial" | undefined>(
    "not_initial"
  );

  const _setAuth = useCallback((auth: AuthValue | undefined) => {
    setAuth(auth);
    setLocalAuth(auth);
  }, []);

  return (
    <GlobalContext.Provider value={{ auth, setAuth: _setAuth }}>
      <Main auth={auth}></Main>
    </GlobalContext.Provider>
  );
}
