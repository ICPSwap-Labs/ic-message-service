import { Box, Button, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { isValidPrincipal, shortenAddress } from "../utils";
import Dialog from "../components/Dialog";
import { useState } from "react";
import { addAdmin, useAdmins, deleteAdmin } from "../hooks/index";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { Principal } from "@dfinity/principal";

export function AdminItem({
  admin,
  onDeleteSuccess,
}: {
  admin: Principal;
  onDeleteSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDeleteAdmin = async () => {
    setLoading(true);

    await deleteAdmin(admin);

    setLoading(false);
    onDeleteSuccess();
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>{shortenAddress(admin.toString())}</TableCell>
      <TableCell>
        <Button disabled={!!loading} onClick={handleDeleteAdmin}>
          delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function Admins() {
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [value, setValue] = useState("");

  const { result: admins, loading } = useAdmins(reload);

  const [addLoading, setAddLoading] = useState(false);

  const handleAddAdmins = async () => {
    setAddLoading(true);
    await addAdmin(Principal.fromText(value));
    setAddLoading(false);
    setReload(!reload);
    setOpen(false);
  };

  let error = "";
  if (value && !isValidPrincipal(value)) error = "Invalid principal";
  if (!value) error = "Enter a principal";

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Breadcrumbs separator=">">
            <Typography color="text.primary">Admins</Typography>
          </Breadcrumbs>

          <Button variant="contained" onClick={() => setOpen(true)}>
            Create Admin
          </Button>
        </Box>

        <Box sx={{ margin: "20px 0 0 0" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Principal</TableCell>
                  <TableCell>Operation</TableCell>
                </TableRow>
              </TableHead>
              {!loading ? (
                <TableBody>
                  {admins?.map((admin) => (
                    <AdminItem
                      key={admin.toString()}
                      admin={admin}
                      onDeleteSuccess={() => setReload(true)}
                    ></AdminItem>
                  ))}
                </TableBody>
              ) : null}
            </Table>

            {!loading && admins?.length === 0 ? <NoData></NoData> : null}
            {loading ? <Loading></Loading> : null}
          </TableContainer>
        </Box>
      </Box>

      <Dialog
        title="Create Admin"
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleAddAdmins}
        loading={addLoading}
        disabled={!!error}
        confirmText={error}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0" }}>
          <TextField
            label="admin"
            fullWidth
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setValue(event.target.value)
            }
          ></TextField>
        </Box>
      </Dialog>
    </>
  );
}
