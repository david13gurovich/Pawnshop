import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import './Profile.css';

function Profile({ user, setUser }) {
    const [editMode, setEditMode] = useState(false);
    const [newUserName, setNewUserName] = useState(user.userName);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const navigate = useNavigate();

    const handleEditUserName = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            const updatedUser = { ...user, userName: newUserName };
            const response = await fetch('https://localhost:7002/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser)
            });
            if (!response.ok) {
                throw new Error("Failed to update username");
            }
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Update user in local storage
            navigate('/home');
        } catch (error) {
            console.error("Error updating username:", error);
        }
    };

    const handleDeleteUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            const response = await fetch(`https://localhost:7002/api/user/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to delete user");
            }
            setUser(null);
            localStorage.removeItem('user'); // Remove user from local storage
            localStorage.removeItem('token'); // Remove token from local storage
            navigate('/login');
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="profile-container">
            <Typography variant="h4" className="greeting">Hello {user.userName}</Typography>
            <div className="profile-options">
                <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                    Edit Data
                </Button>
                <Button variant="contained" color="secondary" onClick={() => setConfirmDelete(true)}>
                    Delete User
                </Button>
            </div>
            <Dialog open={editMode} onClose={() => setEditMode(false)}>
                <DialogTitle>Edit Username</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Username"
                        type="text"
                        fullWidth
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditMode(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditUserName} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this user?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDeleteUser} color="secondary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <Button className="back-home-button" variant="contained" onClick={() => navigate('/home')}>
                Back to Home
            </Button>
        </div>
    );
}

export default Profile;
