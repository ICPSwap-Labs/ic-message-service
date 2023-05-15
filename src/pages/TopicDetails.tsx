import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Link,
  TextField,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { shortenAddress } from "../utils/index";
import Dialog from "../components/Dialog";
import { useState } from "react";
import useParsedQueryString from "../hooks/useParsedQueryString";
import { useQueues } from "../hooks/index";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { createQueue, deleteQueue } from "../hooks/index";
import { Queue } from "../types/mq";
import { Principal } from "@dfinity/principal";
import { isValidPrincipal } from "../utils/index";

function QueueItem({
  queue,
  onDeleteSuccess,
}: {
  queue: Queue;
  onDeleteSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDeleteQueue = async () => {
    setLoading(true);

    const isDeleteSuccess = await deleteQueue(queue.topic, queue.subscriber);

    setLoading(false);

    if (isDeleteSuccess) {
      onDeleteSuccess();
    }
  };

  return (
    <TableRow
      key={queue.name}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell>{queue.name}</TableCell>
      <TableCell>{shortenAddress(queue.subscriber.toString())}</TableCell>
      <TableCell>{queue.messages.toString()}</TableCell>
      <TableCell>
        <Button onClick={handleDeleteQueue} disabled={loading}>
          delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

export type Values = {
  topic: string;
  name: string;
  subscriber: string;
};

export default function TopicDetails() {
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({} as Values);

  const { code, name } = useParsedQueryString() as {
    code: string;
    name: string;
  };

  const { result: queues, loading: queuesLoading } = useQueues(code, reload);

  const handleFiledChange = (
    value: string,
    filed: "topic" | "name" | "subscriber"
  ) => {
    setValues((prevState) => ({
      ...prevState,
      [filed]: value,
    }));
  };

  const handleCreateQueue = async () => {
    setLoading(true);

    await createQueue({
      ...values,
      subscriber: Principal.fromText(values.subscriber),
      messages: BigInt(0),
      lastConsumeAt: BigInt(0),
      topic: code,
    } as Queue);

    setLoading(false);
    setOpen(false);
    setReload(!reload);
  };

  const handleDeleteSuccess = () => {
    setReload(!reload);
  };

  let error = "";
  if (!values.subscriber) error = "Enter the subscriber";
  if (!values.name) error = "Enter the name";
  if (values.subscriber && !isValidPrincipal(values.subscriber))
    error = "Invalid principal";

  return (
    <>
      <Box sx={{ width: "100%", display: "flex" }}>
        <Box sx={{ display: "flex", flex: 1, alignItems: "center" }}>
          <Breadcrumbs separator=">">
            <Link underline="hover" color="inherit" href="#/">
              Topics
            </Link>
            <Typography color="text.primary">{name}</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Typography>Name: {name}</Typography>
        <Typography>Code: {code}</Typography>
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", flex: 1, alignItems: "center" }}>
            <Typography>Queues</Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              gap: "0 20px",
            }}
          >
            <Button variant="contained" onClick={() => setReload(!reload)}>
              Refresh
            </Button>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Create queue
            </Button>
          </Box>
        </Box>

        <Box sx={{ margin: "40px 0 0 0" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Subscriber</TableCell>
                  <TableCell>Messages</TableCell>
                  <TableCell>Operation</TableCell>
                </TableRow>
              </TableHead>
              {!queuesLoading ? (
                <TableBody>
                  {queues?.map((queue, index) => (
                    <QueueItem
                      key={`${queue.name}_${index}`}
                      queue={queue}
                      onDeleteSuccess={handleDeleteSuccess}
                    ></QueueItem>
                  ))}
                </TableBody>
              ) : null}
            </Table>

            {queuesLoading ? <Loading></Loading> : null}
            {!queuesLoading && queues?.length === 0 ? <NoData></NoData> : null}
          </TableContainer>
        </Box>
      </Box>

      <Dialog
        title="Create Queue"
        onClose={() => setOpen(false)}
        open={open}
        loading={loading}
        onConfirm={handleCreateQueue}
        disabled={!!error}
        confirmText={error}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0" }}>
          <TextField fullWidth label="Topic" disabled value={code}></TextField>
          <TextField
            label="Name"
            fullWidth
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleFiledChange(event.target.value, "name")
            }
          ></TextField>
          <TextField
            label="Subscriber"
            fullWidth
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleFiledChange(event.target.value, "subscriber")
            }
          ></TextField>
        </Box>
      </Dialog>
    </>
  );
}
