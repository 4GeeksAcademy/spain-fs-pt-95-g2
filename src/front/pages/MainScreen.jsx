import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "../assets/img/logo.png";

const faqs = [
  {
    question: "What is EasyInventory?",
    answer: "It is an app designed to manage inventories in a simple, collaborative, and efficient way."
  },
  {
    question: "Do I need to create an account to use it?",
    answer: "Yes, each user must register to access the features."
  },
  {
    question: "Can I manage multiple inventories?",
    answer: "Yes, you can access several inventories with different roles (admin or viewer)."
  }
];

const MainScreen = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          mb: 4
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#1E65A6", mb: 0.2 }}>
          Welcome to
        </Typography>
        <img
          src={logo}
          alt="logo"
          style={{
            height: 450,
            filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))",
            marginTop: -2
          }}
        />
      </Box>
      <Typography variant="body1" sx={{ mb: 5, textAlign: "center" }}>
        EasyInventory helps you keep track of your products, orders, and transactions through a modern and efficient interface. Share inventories with your team and stay in sync at all times.
      </Typography>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, textAlign: "center" }}>
        FAQ'S
      </Typography>
      {faqs.map((faq, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default MainScreen;
