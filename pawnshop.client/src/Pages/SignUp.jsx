import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import './SignUp.css';

function Signup() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const response = await fetch('https://localhost:7002/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            },
            body: JSON.stringify({ userName, email, password })
        });

        if (response.ok) {
            navigate('/login');
        } else {
            alert('Signup failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="xs" className="signup-container">
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div" className="text-center">
                        Signup
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="User Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
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
                        <TextField
                            label="Confirm Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Signup
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}

export default Signup;
