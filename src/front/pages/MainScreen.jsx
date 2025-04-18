import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "../assets/img/logo.png";
import banner from "../assets/img/estant.png";
import banner1 from "../assets/img/estant1.png";
import { useNavigate } from "react-router-dom";
import Submenu from "../components/SubMenu";

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
  const [showFaqs, setShowFaqs] = useState(false);
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "#f5f8fb", minHeight: "100vh", pt: 10, pb: 8 }}>
      <Container maxWidth="lg">
        <Submenu />

        <Grid container spacing={4} alignItems="center" sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h3" fontWeight="800" color="#1E65A6" gutterBottom>
              Easy Inventory
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              EasyInventory is a modern and intuitive web app built to make inventory management easier, smarter, and more accessible — 
              especially for small and medium businesses.
              With EasyInventory, you can keep full control over your <strong>Products</strong>, manage your <strong>Suppliers</strong>, 
              organize your <strong>Categories</strong>,and track multiple <strong>Inventories</strong> — all from a single, user-friendly platform.
              Whether you run a small local store or you're part of a growing team, EasyInventory helps you:
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>Easily register and classify your products
              Monitor stock levels and price updates in real time
              Track transactions and movements
              Maintain updated contact info and order history for your suppliers
              Collaborate with different team members with personalized roles
              Designed with efficiency and simplicity at its core, EasyInventory gives you all the tools you need to save time, reduce errors, and stay focused on what matters — your business.
              No complicated interfaces. No overwhelming features. Just everything you need to keep your warehouse organized and your business running smoothly.
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: "2px solid #e0e0e0", my: 4 }} />

        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{
            flexWrap: { xs: "wrap", md: "nowrap" },
            display: "flex",
            gap: 4,
            mt: 2
          }}
        >
          {[{
            title: "Manage Your Warehouses",
            desc: "Oversee all your inventories, locations and teams efficiently and clearly.",
            image: banner,
            link: "/inventories"
          },
          {
            title: "Control Your Products",
            desc: "Track stock levels, prices, categories and product activity with ease.",
            image: logo,
            link: "/products"
          },
          {
            title: "Supplier Directory",
            desc: "Keep track of your suppliers, contacts, and their associated orders.",
            image: banner1,
            link: "/suppliers"
          }].map((card, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                onClick={() => navigate(card.link)}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "0.3s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  '&:hover': {
                    transform: "scale(1.03)",
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia component="img" height="180" image={card.image} alt={card.title} />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{card.title}</Typography>
                  <Typography variant="body2">{card.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="contained"
            onClick={() => setShowFaqs(!showFaqs)}
            sx={{ backgroundColor: "#1E65A6", "&:hover": { backgroundColor: "#154c7b" } }}
          >
            FAQ'S
          </Button>
        </Box>

        <Collapse in={showFaqs} sx={{ mt: 4 }}>
          <Card elevation={3}>
            <CardContent>
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
            </CardContent>
          </Card>
        </Collapse>
      </Container>
    </Box>
  );
};

export default MainScreen;
