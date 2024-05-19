import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import './Login.css';

function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://localhost:7002/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const { token, user } = await response.json();
                setUser(user);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);
                navigate('/home');
            } else {
                const errorText = await response.text();
                console.error('Login failed:', errorText);
                alert('Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            alert('An error occurred during login. Please try again later.');
        }
    };

    return (
        <Container maxWidth="xs" className="login-container">
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div" className="text-center">
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Login
                        </Button>
                    </form>
                    <Typography variant="body2" className="text-center mt-3">
                        <Link to="/signup">Don't have an account? Sign up</Link>
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
}

export default Login;
