import { Box } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      loading...
    </Box>
  );
}
