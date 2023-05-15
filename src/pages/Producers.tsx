import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Paper,
  TextField,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SimpleDialog from "../components/Dialog";
import { shortenAddress, isValidPrincipal } from "../utils";
import { useProducers, addProducer, deleteProducer } from "../hooks/index";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { Principal } from "@dfinity/principal";

export function ProducerItem({
  producer,
  onDeleteSuccess,
}: {
  producer: Principal;
  onDeleteSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDeleteProducer = async () => {
    setLoading(true);
    await deleteProducer(producer);
    setLoading(false);
    onDeleteSuccess();
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        {shortenAddress(producer.toString())}
      </TableCell>

      <TableCell>
        <Button disabled={!!loading} onClick={handleDeleteProducer}>
          delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function Producers() {
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [value, setValue] = useState("");

  const { result: producers, loading } = useProducers(reload);

  const handleAddProducer = async () => {
    setAddLoading(true);

    await addProducer(Principal.fromText(value));

    setAddLoading(false);
    setReload(!reload);
    setOpen(false);
  };

  const handleDeleteSuccess = () => {
    setReload(!reload);
  };

  let error = "";
  if (value && !isValidPrincipal(value)) error = "Invalid principal";
  if (!value) error = "Enter a principal";

  return (
    <>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
            <Breadcrumbs separator=">">
              <Typography color="text.primary">Producers</Typography>
            </Breadcrumbs>
          </Box>

          <Button variant="contained" onClick={() => setOpen(true)}>
            Create producer
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
                  {producers?.map((producer) => (
                    <ProducerItem
                      key={producer.toString()}
                      producer={producer}
                      onDeleteSuccess={handleDeleteSuccess}
                    ></ProducerItem>
                  ))}
                </TableBody>
              ) : null}
            </Table>

            {!loading && producers?.length === 0 ? <NoData></NoData> : null}
            {loading ? <Loading></Loading> : null}
          </TableContainer>
        </Box>
      </Box>

      <SimpleDialog
        title="Create Producer"
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleAddProducer}
        disabled={!!error}
        confirmText={error}
        loading={addLoading}
      >
        <TextField
          label="Producer"
          fullWidth
          value={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setValue(event.target.value)
          }
        ></TextField>
      </SimpleDialog>
    </>
  );
}
