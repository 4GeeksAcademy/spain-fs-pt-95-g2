import React from "react";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";

const Submenu = () => {
  const items = [
    { to: "/products", label: "Products", icon: <Inventory2OutlinedIcon /> },
    { to: "/categories", label: "Categories", icon: <CategoryOutlinedIcon /> },
    { to: "/suppliers", label: "Suppliers", icon: <GroupAddOutlinedIcon /> },
    { to: "/inventories", label: "Inventories", icon: <WarehouseOutlinedIcon /> },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 3,
        flexWrap: "wrap",
        my: 5,
        px: 2
      }}
    >
      {items.map(({ to, label, icon }) => (
        <Link key={label} to={to} style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            startIcon={icon}
            sx={{
              px: 4,
              py: 1.8,
              fontWeight: "bold",
              fontSize: "1.05rem",
              color: "#1E65A6",
              borderColor: "#1E65A6",
              borderRadius: "12px",
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "#f0f8ff",
                borderColor: "#154c7b",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }
            }}
          >
            {label}
          </Button>
        </Link>
      ))}
    </Box>
  );
};

export default Submenu;
