import React, { useState, useEffect } from "react";
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
import logo from "../assets/img/products.png";
import banner from "../assets/img/estant.png";
import banner1 from "../assets/img/suppliers.png";
import { useNavigate } from "react-router-dom";

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

const contentMap = {
  default: (
    <>
      <Typography variant="body1" sx={{ mb: 2 }}>
        EasyInventory is a modern and intuitive web app built to make inventory management easier, smarter,
        and more accessible — especially for small and medium businesses. With EasyInventory, you can keep full control over your <strong>Products</strong>, manage your <strong>Suppliers</strong>, organize your <strong>Categories</strong>, and track multiple <strong>Inventories</strong> — all from a single, user-friendly platform. Whether you run a small local store or you're part of a growing team, EasyInventory helps you:
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>Easily register and classify your products</Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>Monitor stock levels and price updates in real time</Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>Track transactions and movements</Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>Maintain updated contact info and order history for your suppliers</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>Collaborate with different team members with personalized roles</Typography>
      <Typography variant="body1">
        No complicated interfaces. No overwhelming features. Just everything you need to keep your warehouse organized and your business running smoothly.
      </Typography>
    </>
  ),
  products: (
    <Typography variant="body1">Here you'll find a variety of products with various visible features, as well as control over them. You can edit, add, or delete them, depending on your role.</Typography>
  ),
  categories: (
    <Typography variant="body1">Organize your items with categories that help you quickly filter and locate inventory. Add or remove items in seconds—everything organized, easy.</Typography>
  ),
  suppliers: (
    <Typography variant="body1">Track supplier details, order history, and maintain strong vendor relationships.</Typography>
  ),
  inventories: (
    <Typography variant="body1">Oversee multiple inventories, locations, and stock movements effortlessly.</Typography>
  )
};

const MainScreen = () => {
  const [showFaqs, setShowFaqs] = useState(false);
  const [contentKey, setContentKey] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) navigate('/navigation');
    const handleReset = () => {
      setContentKey("default");
    };
    window.addEventListener("resetContent", handleReset);
    return () => window.removeEventListener("resetContent", handleReset);
  }, []);

  return (
    <Box sx={{ bgcolor: "#f5f8fb", minHeight: "100vh", pt: { xs: '3px', md: '32px' }, pb: 8 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
            mb: 6
          }}
        >
          <Button variant="outlined" onClick={() => setContentKey("products")} sx={{ color: "#1E65A6", borderColor: "#1E65A6" }}>Products</Button>
          <Button variant="outlined" onClick={() => setContentKey("categories")} sx={{ color: "#1E65A6", borderColor: "#1E65A6" }}>Categories</Button>
          <Button variant="outlined" onClick={() => setContentKey("suppliers")} sx={{ color: "#1E65A6", borderColor: "#1E65A6" }}>Suppliers</Button>
          <Button variant="outlined" onClick={() => setContentKey("inventories")} sx={{ color: "#1E65A6", borderColor: "#1E65A6" }}>Inventories</Button>
        </Box>

        <Grid container spacing={4} alignItems="center" sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight="800" color="#1E65A6" gutterBottom>
              Easy Inventory
            </Typography>
            {contentMap[contentKey]}
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
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
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
