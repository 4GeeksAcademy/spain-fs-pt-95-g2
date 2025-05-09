import React, { useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box'
import PropTypes from "prop-types";
import Suppliers from "./Suppliers";
import ProductDetails from "./ProductDetails";
import { Button } from "@mui/material";
import ProductList from "../pages/ProductList";
import Categories from "./Categories";
import TransactionList from "./TransactionList";
import { Logout } from "./Logout";

                                                                                                       


function OnePanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && <Box sx={{ p: 3 }}> {children}</Box>}
        </div>
    )
}

OnePanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function getTabsProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

const Navigation = () => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) navigate('/');
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs">
                    <Tab label="Products List" {...getTabsProps(0)} />
                    <Tab label="Products Cards" {...getTabsProps(1)} />
                    <Tab label="Suppliers List" {...getTabsProps(2)} />
                    <Tab label="Categories" {...getTabsProps(3)} />
                    <Tab label="Transactions" {...getTabsProps(4)} />
                    
                   
                </Tabs>
            </Box>
            <OnePanel value={value} index={0}>
                <ProductList/>
            </OnePanel>
            <OnePanel value={value} index={1}>
                <ProductDetails/>
            </OnePanel>
            <OnePanel value={value} index={2}>
                <Suppliers />
            </OnePanel>
            <OnePanel value={value} index={3}>
                <Categories />
            </OnePanel>
            <OnePanel value={value} index={4}>
                <TransactionList />
            </OnePanel>

        </>
    )
}

export default Navigation
