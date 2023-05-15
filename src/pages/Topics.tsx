import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Paper,
  TextField,
  Link,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Dialog from "../components/Dialog";
import { useState } from "react";
import { useTopics, createTopic, deleteTopic } from "../hooks/index";
import { Topic } from "../types/mq";
import Loading from "../components/Loading";
import NoData from "../components/NoData";

function TopicItem({
  topic,
  onDeleteSuccess,
}: {
  topic: Topic;
  onDeleteSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDeleteTopic = async () => {
    setLoading(true);
    await deleteTopic(topic.code);
    setLoading(false);
    onDeleteSuccess();
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>
        <Link href={`#/topic/details?code=${topic.code}&name=${topic.name}`}>
          {topic.code}
        </Link>
      </TableCell>
      <TableCell>{topic.name}</TableCell>
      <TableCell>
        <Button disabled={loading} onClick={handleDeleteTopic}>
          delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

export type Values = {
  code: string;
  name: string;
};

export default function Topics() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const [values, setValues] = useState<Values>({} as Values);

  const { result: topics, loading: topicsLoading } = useTopics(reload);

  const handleFiledChange = (value: string, filed: "code" | "name") => {
    setValues((prevState) => ({
      ...prevState,
      [filed]: value,
    }));
  };

  const handleConfirm = async () => {
    setLoading(true);
    await createTopic(values);
    setLoading(false);
    setReload(!reload);
    setOpen(false);
  };

  const handleDeleteSuccess = () => {
    setReload(!reload);
  };

  return (
    <>
      <Box sx={{ width: "100%", display: "flex" }}>
        <Box sx={{ display: "flex", flex: 1, alignItems: "center" }}>
          <Breadcrumbs separator=">">
            <Typography color="text.primary">Topics</Typography>
          </Breadcrumbs>
        </Box>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Create Topic
        </Button>
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Operation</TableCell>
              </TableRow>
            </TableHead>
            {!topicsLoading ? (
              <TableBody>
                {topics?.map((topic, index) => (
                  <TopicItem
                    key={`${topic.name}_${index}`}
                    topic={topic}
                    onDeleteSuccess={handleDeleteSuccess}
                  ></TopicItem>
                ))}
              </TableBody>
            ) : null}
          </Table>

          {topicsLoading ? <Loading></Loading> : null}
          {!topicsLoading && topics?.length === 0 ? <NoData></NoData> : null}
        </TableContainer>
      </Box>

      <Dialog
        title="Create Topic"
        onClose={() => setOpen(false)}
        open={open}
        loading={loading}
        onConfirm={handleConfirm}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0" }}>
          <TextField
            label="Code"
            fullWidth
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleFiledChange(event.target.value, "code")
            }
          ></TextField>
          <TextField
            label="Name"
            fullWidth
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleFiledChange(event.target.value, "name")
            }
          ></TextField>
        </Box>
      </Dialog>
    </>
  );
}
