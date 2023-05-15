import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { Role } from "./Auth";

type Menu = {
  key: string;
  label: string;
  path: string;
};

function SidebarItem({ menu }: { menu: Menu }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(menu.path);
  };

  return (
    <Box
      sx={{ cursor: "pointer", margin: "0 0 20px 0", padding: "10px" }}
      onClick={handleNavigate}
    >
      <Typography
        color="#ffffff"
        sx={{
          fontSize: " 18px",
          fontWeight: 600,
        }}
      >
        {menu.label}
      </Typography>
    </Box>
  );
}

const menus: Menu[] = [
  { key: "Topics", label: "Topics", path: "/" },
  { key: "Producer", label: "Producer", path: "/producer" },
  { key: "Admins", label: "Admins", path: "/admin" },
  { key: "Errors", label: "Errors", path: "/errors" },
];

export default function Sidebar({ role }: { role: Role }) {
  return (
    <Box sx={{ background: "#1976d2", width: "243px", minHeight: "100vh" }}>
      {menus.map((ele) => {
        if (ele.label === "Admins") {
          return role === "owner" ? (
            <SidebarItem key={ele.path} menu={ele}></SidebarItem>
          ) : null;
        }

        return <SidebarItem key={ele.path} menu={ele}></SidebarItem>;
      })}
    </Box>
  );
}
