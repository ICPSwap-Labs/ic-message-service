import { Box, Typography } from "@mui/material";
import { useLogout } from "../hooks/useAuth";
import { shortenAddress } from "../utils/index";
import GlobalContext from "../GlobalContext";
import { useContext } from "react";
import copyToClipboard from "copy-to-clipboard";

export default function Header() {
  const { auth } = useContext(GlobalContext);
  const logout = useLogout();

  const handleCopy = () => {
    if (auth !== "not_initial" && !!auth?.principal) {
      copyToClipboard(auth.principal);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "0 20px" }}>
      <Typography color="#000" onClick={handleCopy} sx={{ cursor: "pointer" }}>
        {auth !== "not_initial" && !!auth?.principal
          ? shortenAddress(auth.principal)
          : null}
      </Typography>
      <Typography color="#000" sx={{ cursor: "pointer" }} onClick={logout}>
        logout
      </Typography>
    </Box>
  );
}
