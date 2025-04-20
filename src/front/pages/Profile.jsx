import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import logo from "../assets/img/logo.png";

const Profile = () => {
  const [user, setUser] = useState(null);
  const PERMISSIONS = { 1: "Visualizer", 2: "Admin" };
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const loadProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const response = await fetch(`${BACKEND_URL}/api/users/id/${userId}`);
        const data = await response.json();
        if (!data.result) return;
        setUser(data.result);
      } catch (error) {
        console.error(error);
      }
    };
    loadProfile();
  }, []);

  if (!user) return <Typography align="center">Loading profile...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box textAlign="center" mb={3}>
        <img src={logo} alt="EasyInventory Logo" style={{ height: 100 }} />
        <Typography variant="h4" fontWeight="bold" mt={2}>
          User Profile
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography><strong>User ID:</strong> {user.id_user}</Typography>
          <Typography><strong>User Name:</strong> {user.username}</Typography>
          <Typography><strong>Email:</strong> {user.email}</Typography>
          <Typography>
            <strong>Created Date:</strong>{" "}
            {new Date(user.created_date).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Expired Date:</strong>{" "}
            {user.expired_date ? new Date(user.expired_date).toLocaleDateString() : "N/A"}
          </Typography>
          <Typography><strong>Staff Number:</strong> {user.staff_number}</Typography>
        </CardContent>
      </Card>

      {user.inventories && user.inventories.length > 0 && (
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
                    secondary={`Permission: ${PERMISSIONS[inv.permissions]}`}
                  />
                </ListItem>
                {idx < user.inventories.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Container>
  );
};

export default Profile;
