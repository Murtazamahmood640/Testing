import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Avatar, CssBaseline, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import desertImage from '../Login/desert.jpg'; // Ensure the correct path

const theme = createTheme();

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(''); // Reset error message
        try {
            const response = await axios.post('https://murtazamahm007-abidipro.mdbgo.io/api/users/login', { email, password });
            console.log(response.data.message);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('email', response.data.email);
            
            const name = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/getName', { params: { email: email } });
            localStorage.setItem('name', name.data);
            let currentUser = localStorage.getItem('email');
            // toast.success(Welcome ${currentUser});
            
            // Redirect to personal page after successful login
            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                setError(error.response.data.error || 'Invalid login credentials');
            } else {
                setError('Something went wrong. Please try again later.');
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: `url(${desertImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <CssBaseline />
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default Login;
