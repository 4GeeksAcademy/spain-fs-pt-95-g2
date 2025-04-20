import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Checkbox,
    CssBaseline,
    FormControlLabel,
    Divider,
    FormLabel,
    FormControl,
    Link,
    TextField,
    Typography,
    Stack,
    Card as MuiCard,
    styled
} from '@mui/material';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../components/CustomIcons';
import { ForgotPassword } from '../components/ForgotPassword';

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

const SignInContainer = styled(Stack)(() => ({
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

export const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [rememberMe, setrememberMe] = useState(false);
    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) navigate('/');
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const validateInputs = () => {
        let isValid = true;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password || password.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 8 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    }

    const clearErrors = () => {
        setEmailError(false);
        setEmailErrorMessage('');
        setPasswordError(false);
        setPasswordErrorMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        try {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');

            clearErrors();

            const response = await fetch(`${BACKEND_URL}api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, remember_me: rememberMe }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError('Incorrect email or password');
                throw new Error(data.error || 'Incorrect credentials');
            }

            if (rememberMe) {
                localStorage.setItem('token', data.access_token);
            } else {
                sessionStorage.setItem('token', data.access_token);
            }

            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <>
            <CssBaseline enableColorScheme />
            <SignInContainer direction="column">
                <Card variant="outlined">
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <SitemarkIcon />
                    </Box>
                    <Typography component='h1' variant="h4" sx={{ width: '100%', textAlign: 'center', fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, mb: 2 }}>
                        Sign in
                    </Typography>
                    <Box
                        component='form'
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, mb: 1, }}
                    >
                        <FormControl>
                            <FormLabel htmlFor='email'>Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => {
                                    setEmailError(false);
                                    setEmailErrorMessage('');
                                }}
                                placeholder='your@email.com'
                                autoComplete='email'
                                required
                                fullWidth
                                variant='outlined'
                                size='small'
                                color={emailError ? 'error' : 'primary'}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: { xs: 40, sm: 48 }
                                    }
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor='password'>Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name='password'
                                placeholder='••••••••'
                                type='password'
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => {
                                    setPasswordError(false);
                                    setPasswordErrorMessage('');
                                }}
                                autoComplete='current-password'
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
                            />
                        </FormControl>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setrememberMe(e.target.checked)}
                                        value="remember"
                                        color="primary"
                                        size="small"
                                    />
                                }
                                label='Remember me'
                                sx={{ '& .MuiTypography-root': { fontSize: { xs: '0.8rem', sm: '0.875rem' } } }}
                            />
                            <Link
                                component='button'
                                type='button'
                                onClick={handleOpenDialog}
                                variant='body2'
                                sx={{ alignSelf: 'center' }}
                            >
                                Forgot your password?
                            </Link>
                        </Box>
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
                            Sign in
                        </Button>

                        {error && (
                            <Typography color='error'>
                                {error}
                            </Typography>
                        )}

                        <ForgotPassword
                            open={openDialog}
                            handleClose={handleCloseDialog}
                            initialEmail={email}
                        />
                    </Box>
                    <Divider sx={{ my: 1 }}>or</Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 1 }}>
                        <Button
                            fullWidth
                            variant='outlined'
                            onClick={() => alert('Sign in with Google')}
                            startIcon={<GoogleIcon />}
                            sx={{
                                py: { xs: 1, sm: 1.25 },
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                color: '#2167a4'
                            }}
                        >
                            Sign in with Google
                        </Button>
                        {/* <Button
                            fullWidth
                            variant='outlined'
                            onClick={() => alert('Sign in with Facebook')}
                            startIcon={<FacebookIcon />}
                            sx={{
                                py: { xs: 1, sm: 1.25 },
                                fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }}
                        >
                            Sign in with Facebook
                        </Button> */}
                    </Box>
                    <Typography
                        sx={{
                            textAlign: 'center',
                            mt: 1,
                            fontSize: { xs: '0.875rem', sm: '0.9rem' }
                        }}
                    >
                        Don't have an account?{' '}
                        <Link
                            href='/signup'
                            variant='body2'
                            sx={{ fontWeight: 500 }}
                        >
                            Sign up
                        </Link>
                    </Typography>
                </Card>
            </SignInContainer>
        </>
    );
}
