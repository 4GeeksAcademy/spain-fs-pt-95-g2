import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Button,
    CssBaseline,
    FormLabel,
    FormControl,
    TextField,
    Typography,
    Stack,
    Card as MuiCard,
    styled,
    List,
    ListItem,
    ListItemIcon,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { SitemarkIcon } from '../components/CustomIcons';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Visibility, VisibilityOff } from '@mui/icons-material';


const Card = styled(MuiCard)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: 24,
    gap: 16,
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',

    '@media (min-width: 600px)': {
        maxWidth: '500px',
        padding: 32,
    },

    '@media (max-width: 600px)': {
        padding: 20,
        margin: 8,
    }
}));

const ResetPasswordContainer = styled(Stack)(() => ({
    height: 'auto',
    minHeight: '100vh',
    padding: 16,
    justifyContent: 'center',

    '@media (min-width: 600px)': {
        padding: 8,
    },

    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
    }
}));

const PasswordRequirements = ({ password }) => {
    const requirements = [
        {
            text: 'At least 8 characters long',
            validator: (pwd) => pwd.length >= 8
        },
        {
            text: 'Starts with a letter',
            validator: (pwd) => /^[A-Za-z]/.test(pwd)
        },
        {
            text: 'Contains at least one uppercase and one lowercase letter',
            validator: (pwd) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd)
        },
        {
            text: 'Contains at least one number',
            validator: (pwd) => /\d/.test(pwd)
        },
        {
            text: 'Contains at least one special character',
            validator: (pwd) => /[\p{P}\p{S}]/u.test(pwd)
        },
    ];

    return (
        <List dense sx={{ py: 0 }}>
            {requirements.map((req, index) => {
                const isValid = req.validator(password);
                return (
                    <ListItem key={index} sx={{ py: 0, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                            {isValid ?
                                <CheckCircleOutlineIcon color='success' fontSize='small' />
                                :
                                <ErrorOutlineIcon color='error' fontSize='small' />
                            }
                        </ListItemIcon>
                        <Typography
                            variant='body2'
                            color={isValid ? 'text.secondary' : 'text.secondary'}
                            sx={{ textDecoration: isValid ? 'none' : 'none' }}
                        >
                            {req.text}
                        </Typography>
                    </ListItem>
                );
            })}
        </List>
    );
};

export const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing token');
        }
    }, [token]);

    const validatePassword = (pw) => {
        switch (true) {

            case pw.length < 8:
                return { validate: false, message: 'Password must be at least 8 characters long.' };

            case !/^[A-Za-z]/.test(pw):
                return { validate: false, message: 'Password must start with a letter.' };

            case !/[a-z]/.test(pw) || !/[A-Z]/.test(pw):
                return { validate: false, message: 'Password must contain at least one uppercase and one lowercase letter.' };

            case !/\d/.test(pw):
                return { validate: false, message: 'Password must contain at least one number.' };

            case !/[\p{P}\p{S}]/u.test(pw):
                return { validate: false, message: 'Password must contain at least one special character.' };

            default:
                return { validate: true, message: 'Valid password' };
        }
    };

    const validateInputs = () => {
        let isValid = true;

        const passwordValidation = validatePassword(password);
        if (!password || !passwordValidation.validate) {
            setPasswordError(true);
            setPasswordErrorMessage(passwordValidation.message);
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage('Passwords do not match');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const clearErrors = () => {
        setPasswordError(false);
        setPasswordErrorMessage('');
        setConfirmPasswordError(false);
        setConfirmPasswordErrorMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        try {
            clearErrors();

            const response = await fetch(`${BACKEND_URL}api/reset-password?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new_password: password }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to reset password');

            setSuccess('Password updated successfully');
            setTimeout(() => navigate('/signin', { replace: true }), 2000);
        } catch (error) {
            setError(error.message);
            console.error('Reset error:', error);
        }
    }

    return (
        <>
            <CssBaseline />
            <ResetPasswordContainer direction='column'>
                <Card variant='outlined'>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <SitemarkIcon />
                    </Box>
                    <Typography
                        component='h1'
                        variant="h4"
                        sx={{ width: '100%', textAlign: 'center', fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, mb: 2 }}>
                        Reset password
                    </Typography>
                    <Box
                        component='form'
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, mb: 2, }}
                    >
                        <FormControl>
                            <FormLabel htmlFor='password'>New password</FormLabel>
                            <TextField
                                autoFocus
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name='password'
                                placeholder='••••••••'
                                type={showPassword ? 'text' : 'password'}
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => {
                                    setShowPasswordRequirements(true);
                                    setPasswordError(false);
                                    setPasswordErrorMessage('');
                                    setError('');
                                }}
                                onBlur={() => setShowPasswordRequirements(false)}
                                autoComplete='new-password'
                                required
                                fullWidth
                                variant='outlined'
                                size='small'
                                color={passwordError ? 'error' : 'primary'}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: { xs: 40, sm: 48 }
                                    }
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge='end'
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            {showPasswordRequirements && (
                                <Box sx={{ mt: 1 }}>
                                    <PasswordRequirements password={password} />
                                </Box>
                            )}
                        </FormControl>
                        <FormControl sx={{ mb: 2 }}>
                            <FormLabel htmlFor='password'>Confirm new password</FormLabel>
                            <TextField
                                error={confirmPasswordError}
                                helperText={confirmPasswordErrorMessage}
                                name='confirm-password'
                                placeholder='••••••••'
                                type='password'
                                id='password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onFocus={() => {
                                    setPasswordError(false);
                                    setPasswordErrorMessage('');
                                    setError('');
                                }}
                                autoComplete='confirm-new-password'
                                required
                                fullWidth
                                variant='outlined'
                                size='small'
                                color={confirmPasswordError ? 'error' : 'primary'}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: { xs: 40, sm: 48 }
                                    }
                                }}
                            />
                        </FormControl>

                        {error && (
                            <Typography color='error' sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}

                        {success && (
                            <Typography color='success' sx={{ mb: 2 }}>
                                {success}
                            </Typography>
                        )}

                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{
                                py: { xs: 1, sm: 1.25 },
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                backgroundColor: '#2167a4'
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Card>
            </ResetPasswordContainer>
        </>
    );
}