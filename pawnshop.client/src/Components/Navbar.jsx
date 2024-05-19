import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import userDefaultImg from '../assets/user_default.jpg';
import './Navbar.css';

function Navbar({ user, setUser, setShowSellForm }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate('/profile');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/home" style={{ color: 'inherit', textDecoration: 'none' }}>PawnShop</Link>
                </Typography>
                <Button variant="contained" color="secondary" onClick={() => setShowSellForm(true)} sx={{ marginRight: '10px' }}>
                    Sell Item
                </Button>
                {user && (
                    <>
                        <Typography variant="body1" component="div" sx={{ marginRight: '10px' }}>
                            Balance: ${user.balance.toFixed(2)}
                        </Typography>
                        <Avatar
                            alt="User"
                            src={userDefaultImg}
                            onClick={handleMenuOpen}
                            sx={{ cursor: 'pointer' }}
                        />
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem disabled>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        '&:hover': {
                                            color: 'tomato',
                                            transform: 'scale(1.05, 1.05)',
                                        },
                                    }}
                                >
                                    {user.userName}
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
