import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useMediaQuery, useTheme } from '@mui/material';



export const Logout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const location =useLocation();
    if(location.pathname === "/") return null;
    if(location.pathname === "/signin") return null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/signin');
    };

    return (
        <>
            {isMobile ? (
                <IconButton
                    onClick={handleLogout}
                    sx={{
                        color: 'error.main',
                        border: '1px solid',
                        borderColor: 'error.main',
                        p: 1,
                        '&:hover': {
                            backgroundColor: 'error.light',
                            borderColor: 'error.dark'
                        }
                    }}
                >
                    <LogoutIcon sx={{ fontSize: 20 }} />
                </IconButton>
            ) : (
                <Button
                    variant="outlined"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon sx={{ fontSize: 20 }} />}
                    sx={{
                        py: 0.5,
                        px: 2,
                        fontSize: '0.875rem',
                        color: 'error.main',
                        borderColor: 'error.main',
                        '&:hover': {
                            backgroundColor: 'error.light',
                            borderColor: 'error.dark'
                        }
                    }}
                >
                    Logout
                </Button>
            )}
        </>
    );
};