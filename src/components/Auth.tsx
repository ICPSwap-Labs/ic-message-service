import { Box, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { useRoles } from "../hooks/index";
import React from "react";
import Header from "./Header";

export function LinearIndeterminate() {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}

export type Role = "admin" | "owner" | undefined;

export type AuthProps = { role: Role };

export default function Auth({
  children,
}: {
  children: (props: AuthProps) => React.ReactElement;
}) {
  const { loading, result } = useRoles();

  let role: Role | "not_initial" = "not_initial";

  if (result) {
    for (let i = 0; i < result.length; i++) {
      const _role = result[i];
      const key = Object.keys(_role)[0];

      if (key === "RoleAdmin") {
        role = "admin";
      } else if (key === "RoleOwner") {
        role = "owner";
        break;
      }
    }

    if (role === "not_initial") {
      role = undefined;
    }
  }

  return loading || role === "not_initial" ? (
    <LinearIndeterminate></LinearIndeterminate>
  ) : !!role ? (
    children({ role })
  ) : (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Box sx={{ padding: "10px" }}>
        <Header></Header>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography sx={{ fontSize: "40px" }}>Permission denied</Typography>
      </Box>
    </Box>
  );
}
