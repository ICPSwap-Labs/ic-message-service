import { Box, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { shortenAddress } from "../utils/index";
import dayjs from "dayjs";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { useErrors } from "../hooks/index";

export default function Errors() {
  const { result: errors, loading: errorsLoading } = useErrors();

  return (
    <Box sx={{ margin: "20px 0 0 0" }}>
      <Box sx={{ display: "flex", margin: "40px 0 0 0" }}>
        <Box sx={{ display: "flex", flex: 1, alignItems: "center" }}>
          <Typography>Errors</Typography>
        </Box>
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Subscriber</TableCell>
                <TableCell>Error</TableCell>
                <TableCell>Messages</TableCell>
              </TableRow>
            </TableHead>
            {!errorsLoading ? (
              <TableBody>
                {errors?.map((error, index) => (
                  <TableRow
                    key={`${error.time}_${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      {dayjs(Number(error.time)).format("YYYY-MM-DD HH:mm:ss")}
                    </TableCell>
                    <TableCell>{error.message.topic}</TableCell>
                    <TableCell>
                      {shortenAddress(error.subscriber.toString())}
                    </TableCell>
                    <TableCell>{error.error}</TableCell>
                    <TableCell>{JSON.stringify(error.message.data)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : null}
          </Table>

          {errorsLoading ? <Loading></Loading> : null}
          {!errorsLoading && errors?.length === 0 ? <NoData></NoData> : null}
        </TableContainer>
      </Box>
    </Box>
  );
}
