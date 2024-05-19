import React from 'react';
import { Box, Typography } from '@mui/material';
import './Footer.css';

function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: 'background.paper', p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
                &copy; 2024 PawnShop. All rights reserved.
            </Typography>
        </Box>
    );
}

export default Footer;
