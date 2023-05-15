import { createTheme } from "@mui/material/styles";

export default function themes() {
  return createTheme({
    palette: {
      mode: "light",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif;",
    },
  });
}
