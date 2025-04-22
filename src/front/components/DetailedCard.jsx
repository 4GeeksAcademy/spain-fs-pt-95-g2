import React from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Chip,
} from "@mui/material";

export const DetailedCard = ({ product }) => {
    if (!product) {
        return (
            <Card sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                    No products available
                </Typography>
            </Card>
        );
    }

    return (
        <Card
            sx={{
                maxWidth: 345,
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                    transform: "scale(1.02)",
                },
            }}
        >
            <CardMedia
                component="img"
                height="180"
                image={
                    product.image_url ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png"
                }
                alt={product.name}
                sx={{ borderBottom: "1px solid #e0e0e0" }}
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        Price:
                    </Typography>
                    <Chip label={`$${product.price}`} color="primary" size="small" />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                        Quantity:
                    </Typography>
                    <Chip label={product.stock} color="primary" size="small" />
                </Box>
            </CardContent>
        </Card>
    );
};

