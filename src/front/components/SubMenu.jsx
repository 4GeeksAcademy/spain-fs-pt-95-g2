import React from "react";
import { Box, Button } from "@mui/material";

const Submenu = ({ onSelect }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        flexWrap: "wrap",
        my: 4
      }}
    >
      <Button variant="outlined" sx={{ color: "#1E65A6", borderColor: "#1E65A6" }} onClick={() => onSelect("products")}>
        Products
      </Button>
      <Button variant="outlined" sx={{ color: "#1E65A6", borderColor: "#1E65A6" }} onClick={() => onSelect("categories")}>
        Categories
      </Button>
      <Button variant="outlined" sx={{ color: "#1E65A6", borderColor: "#1E65A6" }} onClick={() => onSelect("suppliers")}>
        Suppliers
      </Button>
      <Button variant="outlined" sx={{ color: "#1E65A6", borderColor: "#1E65A6" }} onClick={() => onSelect("inventories")}>
        Inventories
      </Button>
    </Box>
  );
};

export default Submenu;
