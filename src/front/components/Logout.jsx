import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/signin');
    };

    return (
        <>
            <Button
                variant="outlined"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                    py: { xs: 1, sm: 1.25 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
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
        </>
    );
};