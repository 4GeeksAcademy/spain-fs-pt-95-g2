import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card as MuiCard,
  styled,
  CssBaseline,
  Stack
} from "@mui/material";
import logo from "../assets/img/logo.png";
import { jwtDecode } from "jwt-decode";

const Card = styled(MuiCard)(() => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "90%",
  padding: 24,
  gap: 16,
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  "@media (min-width: 600px)": {
    maxWidth: "700px",
    width: "100%",
    padding: 32
  },
  "@media (max-width: 600px)": {
    padding: 20,
    margin: 8
  }
}));

const ProfileContainer = styled(Stack)(() => ({
  position: "relative",
  minHeight: "100vh",
  padding: 16,
  justifyContent: "center",
  "@media (min-width: 600px)": {
    padding: 8
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat"
  }
}));

const Profile = () => {
  const [user, setUser] = useState(null);
  const PERMISSIONS = { 1: "Visualizer", 2: "Admin" };
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const loadProfile = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;
      const { sub: userId } = jwtDecode(token);
      if (!userId) return;
      try {
        const response = await fetch(
          `${BACKEND_URL}api/users/id/${userId}`
        );
        const data = await response.json();
        if (data.result) {
          setUser(data.result);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadProfile();
  }, []);

  if (!user) {
    return <Typography align="center">Loading profile...</Typography>;
  }

  return (
    <>
      <CssBaseline enableColorScheme />
      <ProfileContainer direction="column">
        <Card variant="outlined">
          <Container>
            <Box textAlign="center" mb={3}>
              <img
                src={logo}
                alt="EasyInventory Logo"
                style={{ height: 100 }}
              />
              <Typography variant="h4" fontWeight="bold" mt={2}>
                User Profile
              </Typography>
            </Box>
            <Box sx={{ mb: 4, p: 2 }}>
              <Typography>
                <strong>User Name:</strong> {user.username}
              </Typography>
              <Typography>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography>
                <strong>Created Date:</strong>{" "}
                {new Date(user.created_date).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Expired Date:</strong>{" "}
                {user.expired_date
                  ? new Date(user.expired_date).toLocaleDateString()
                  : "N/A"}
              </Typography>
              <Typography>
                <strong>Staff Number:</strong> {user.staff_number}
              </Typography>
            </Box>
            {user.inventories?.length > 0 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Assigned Inventories
                </Typography>
                <List>
                  {user.inventories.map((inv, idx) => (
                    <React.Fragment key={idx}>
                      <ListItem>
                        <ListItemText
                          primary={`${inv.inventory.name} (${inv.inventory.location})`}
                          secondary={`Permission: ${
                            PERMISSIONS[inv.permissions]
                          }`}
                        />
                      </ListItem>
                      {idx < user.inventories.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}
          </Container>
        </Card>
      </ProfileContainer>
    </>
  );
};

export default Profile;
