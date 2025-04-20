import React, {useState} from "react";
import { Router, Link } from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box'
import PropTypes from "prop-types";
import Suppliers from "./Suppliers";
import ProductDetails from "./ProductDetails";
import  { Button }  from "@mui/material";
import ProductList from "../pages/ProductList";

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs">
                        <Tab label="Suppliers" {...getTabsProps(0)} />
                        <Tab label="Products" {...getTabsProps(1)} />
                        <Tab label="Feature Name" {...getTabsProps(2)} />
                        <Tab label="Feature Name" {...getTabsProps(3)} />
                    </Tabs>
                </Box>
                <OnePanel value={value} index={0}>
                    <Suppliers></Suppliers>
                </OnePanel>
                <OnePanel value={value} index={1}>
                    <ProductDetails></ProductDetails>
                </OnePanel>
                <OnePanel value={value} index={2}>
                    <ProductList/>
                </OnePanel>
                <OnePanel value={value} index={3}>
                    Feature
                </OnePanel>
        </>
    )
}

export default Navigation
