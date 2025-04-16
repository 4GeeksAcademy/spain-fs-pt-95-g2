import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    CssBaseline,
    Divider,
    FormLabel,
    FormControl,
    Link,
    TextField,
    Typography,
    Stack,
    Card as MuiCard,
    styled,
    List,
    ListItem,
    ListItemIcon
} from '@mui/material';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../components/CustomIcons';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '500px',
        padding: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2.5),
        margin: theme.spacing(1),
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    height: 'auto',
    minHeight: '100vh',
    padding: theme.spacing(2),
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(1),
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
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

const PasswordRequirements = ({ password }) => {
    const requirements = [
        {
            text: 'At least 8 characters long',
            validator: (pwd) => pwd.length >= 8
        },
        {
            text: 'Contains at least one uppercase and one lowercase letter',
            validator: (pwd) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd)
        },
        {
            text: 'Starts with a letter',
            validator: (pwd) => /^[A-Za-z]/.test(pwd)
        },
        {
            text: 'Contains at least one special character (@$!%*?&.,;)',
            validator: (pwd) => /[@$!%*?&.,;]/.test(pwd)
        },
        {
            text: 'Contains at least one number',
            validator: (pwd) => /\d/.test(pwd)
        }
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

export const Signup = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const validatePassword = (password) => {

        if (password.length < 8) {
            return { validate: false, message: 'Password must be at least 8 characters long.' };
        }

        if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
            return { validate: false, message: 'Password must contain at least one uppercase and one lowercase letter.' };
        }

        if (!/^[A-Za-z]/.test(password)) {
            return { validate: false, message: 'Password must start with a letter.' };
        }

        if (!/[@$!%*?&.,;]/.test(password)) {
            return { validate: false, message: 'Password must contain at least one special character.' };
        }

        if (!/\d/.test(password)) {
            return { validate: false, message: 'Password must contain at least one number.' };
        }

        return { validate: true, message: 'Valid password' };
    }

    const validateInputs = () => {
        let isValid = true;

        if (!username || username.trim().length < 1) {
            setUsernameError(true);
            setUsernameErrorMessage('Username is required.');
            isValid = false;
        } else if (username.length < 3) {
            setUsernameError(true);
            setUsernameErrorMessage('Username must be at least 3 characters long.');
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage('');
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        const passwordValidation = validatePassword(password);
        if (!password || !passwordValidation.validate) {
            setPasswordError(true);
            setPasswordErrorMessage(passwordValidation.message);
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        try {
            const response = await fetch(`${BACKEND_URL}api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 409) {
                    setEmailError(true);
                    setEmailErrorMessage(data.message || 'This email is already registered.');
                    return;
                }
                throw new Error(data.message || 'Signup failed');
            }

            navigate('/signin');
        } catch (error) {
            console.error('Signup error:', error);
            alert('Signup failed. Please try again.');
        }
    };

    return (
        <>
            <CssBaseline enableColorScheme />
            <SignUpContainer direction="column">
                <Card variant="outlined">
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <SitemarkIcon />
                    </Box>
                    <Typography
                        component='h1'
                        variant="h4"
                        sx={{ width: '100%', textAlign: 'center', fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, mb: 2 }}>
                        Sign up
                    </Typography>
                    <Box
                        component='form'
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, mb: 2, }}
                    >
                        <FormControl>
                            <FormLabel htmlFor='userame'>Username</FormLabel>
                            <TextField
                                error={usernameError}
                                helperText={usernameErrorMessage}
                                id='username'
                                type='username'
                                name='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder='Your username'
                                autoComplete='username'
                                required
                                fullWidth
                                variant='outlined'
                                size='small'
                                color={usernameError ? 'error' : 'primary'}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: { xs: 40, sm: 48 }
                                    }
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor='email'>Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id='email'
                                type='email'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                onFocus={() => setShowPasswordRequirements(true)}
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
                            />
                            {showPasswordRequirements && (
                                <Box sx={{ mt: 1 }}>
                                    <PasswordRequirements password={password} />
                                </Box>
                            )}
                        </FormControl>
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{ py: { xs: 1, sm: 1.25 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                            Sign up
                        </Button>
                    </Box>
                    <Divider sx={{ my: 2 }}>or</Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 1 }}>
                        <Button
                            fullWidth
                            variant='outlined'
                            onClick={() => alert('Sign up with Google')}
                            startIcon={<GoogleIcon />}
                            sx={{
                                py: { xs: 1, sm: 1.25 },
                                fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }}
                        >
                            Sign up with Google
                        </Button>
                        {/* <Button
                            fullWidth
                            variant='outlined'
                            onClick={() => alert('Sign up with Facebook')}
                            startIcon={<FacebookIcon />}
                            sx={{
                                py: { xs: 1, sm: 1.25 },
                                fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }}
                        >
                            Sign up with Facebook
                        </Button> */}
                    </Box>
                    <Typography
                        sx={{
                            textAlign: 'center',
                            mt: 1,
                            fontSize: { xs: '0.875rem', sm: '0.9rem' }
                        }}
                    >
                        Already have an account?{' '}
                        <Link
                            href='/signin'
                            variant='body2'
                            sx={{ fontWeight: 500 }}
                        >
                            Sign in
                        </Link>
                    </Typography>
                </Card>
            </SignUpContainer>
        </>
    );
}