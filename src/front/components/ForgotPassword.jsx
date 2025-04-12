import React, { useState } from "react";
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    OutlinedInput,
    CircularProgress,
  } from '@mui/material';

export const ForgotPassword = ({ open, handleClose, initialEmail = '' }) => {
    const [email, setEmail] = useState(initialEmail);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleCloseDialog = () => {
        setSuccess(false);
        setError(null);
        handleClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BACKEND_URL}api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }
            setSuccess(true);
        } catch (error) {
            setError(error.message || 'Failed to send reset password email');
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Dialog
            open={open}
            onClose={handleCloseDialog}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: handleSubmit,
                    sx: { backgroundImage: 'none' },
                },
            }}
        >
            <DialogTitle>Reset password</DialogTitle>
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
            >
                {success ? (
                    <DialogContentText>
                        We've sent a password reset link to your email address. Please check your inbox.
                    </DialogContentText>
                ) : (
                    <>
                        <DialogContentText>
                            Enter your account&apos;s email address, and we&apos;ll send you a link to
                            reset your password.
                        </DialogContentText>
                        <OutlinedInput
                            autoFocus
                            required
                            margin='dense'
                            id='email'
                            name='email'
                            label='Email address'
                            placeholder='Email address'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            error={!!error}
                        />
                        {error && (
                            <DialogContentText color='error'>
                                {error}
                            </DialogContentText>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ pb: 3, px: 3 }}>
                {!success && (
                    <>
                        <Button onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button
                            variant='contained'
                            type='submit'
                            disabled={isLoading || !email}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color='inherit' />
                            ) : (
                                'Continue'
                            )}
                        </Button>
                    </>
                )}
                {success && (
                    <Button onClick={handleClose} variant='contained'>
                        Close
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}

ForgotPassword.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    initialEmail: PropTypes.string,
};