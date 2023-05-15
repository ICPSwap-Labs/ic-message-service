import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useConnect } from "../hooks/useAuth";
import { DialogContent } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Wallet } from "../types/index";
import GlobalContext from "../GlobalContext";
import { useContext } from "react";

const wallets = [
  { label: "Internet Identity", wallet: Wallet.IC },
  { label: "Plug Wallet", wallet: Wallet.PLUG },
];

export default function Connector() {
  const connect = useConnect();

  const { auth } = useContext(GlobalContext);

  const handleConnect = async (wallet: Wallet) => {
    await connect(wallet);
  };

  return (
    <Dialog open={auth === "not_initial" || !auth?.wallet}>
      <DialogTitle id="alert-dialog-title">Connect Wallet</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            minWidth: "520px",
            padding: "20px 0 0 0",
            display: "flex",
            flexDirection: "column",
            gap: "20px 0",
          }}
        >
          {wallets.map((wallet) => (
            <Typography
              key={wallet.wallet}
              color="#000"
              sx={{ fontSize: "28px", cursor: "pointer" }}
              onClick={() => handleConnect(wallet.wallet)}
            >
              {wallet.label}
            </Typography>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
