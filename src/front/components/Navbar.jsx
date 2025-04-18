import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AppBar, Toolbar, Button, Box, Typography, IconButton } from "@mui/material";
import icono from "../assets/img/solologo.png";

export const Navbar = () => {
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      localStorage.setItem("resetContent", "true");
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={3}
      sx={{
        background: "linear-gradient(to right, #e3eaf4, #f8f9fa)",
        borderBottom: "1px solid #ccc",
        paddingY: 1,
        px: { xs: 2, md: 6 },
        zIndex: 1201
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src={icono}
            alt="EasyInventory"
            style={{ height: 42, cursor: "pointer" }}
            onClick={handleLogoClick}
          />
          <Typography
            variant="h6"
            onClick={handleLogoClick}
            sx={{
              fontWeight: "bold",
              color: "#1E65A6",
              display: { xs: "none", sm: "block" },
              textDecoration: "none",
              cursor: "pointer"
            }}
          >
            EasyInventory
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link to="/contact" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#1E65A6",
                color: "#1E65A6",
                fontWeight: 500,
                borderRadius: "20px",
                px: 3,
                textTransform: "none",
                '&:hover': {
                  backgroundColor: "#1E65A6",
                  color: "white"
                }
              }}
            >
              Contact Us
            </Button>
          </Link>

          {!isLogged ? (
            <Link to="/signin" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1E65A6",
                  borderRadius: "20px",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 3,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  '&:hover': {
                    backgroundColor: "#154c7b"
                  }
                }}
              >
                Login
              </Button>
            </Link>
          ) : (
            <Link to="/profile">
              <IconButton>
                <AccountCircleIcon sx={{ fontSize: 32, color: "#1E65A6" }} />
              </IconButton>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
