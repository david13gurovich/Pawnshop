import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Card, CardMedia, CardContent, CardActions, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import './Home.css';

function Home({ user, setUser }) {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showSellForm, setShowSellForm] = useState(false);
    const [newItem, setNewItem] = useState({
        itemDescription: '',
        price: '',
        category: '',
        image: null
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing stored user:", error);
            }
        }
        fetchItems();
        fetchCategories();
    }, []);

    const fetchItems = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            const response = await fetch('https://localhost:7002/api/item', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch items");
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const fetchCategories = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            const response = await fetch('https://localhost:7002/api/item/getAllCategories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategories(
            e.target.checked
                ? [...selectedCategories, value]
                : selectedCategories.filter(category => category !== value)
        );
    };

    const handleFilterItems = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            if (selectedCategories.length === 0) {
                setItems([]); // Show nothing if no categories are selected
            } else {
                const categoryString = selectedCategories.join(',');
                const response = await fetch(`https://localhost:7002/api/item/getItemsByCategories?categories=${categoryString}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch filtered items");
                }
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Error filtering items:", error);
        }
    };

    const handleUpdateUser = async (updatedUser) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            const response = await fetch('https://localhost:7002/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser)
            });
            if (!response.ok) {
                throw new Error("Failed to update user balance");
            }
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Update user in local storage
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleSellItem = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('itemDescription', newItem.itemDescription);
            formData.append('price', newItem.price);
            formData.append('category', newItem.category);
            if (newItem.image) {
                formData.append('image', newItem.image);
            }

            const response = await fetch('https://localhost:7002/api/item/sell', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Failed to sell item");
            }
            const data = await response.json();

            // Use the price input by the user to update the balance
            const updatedUser = { ...user, balance: user.balance + parseFloat(newItem.price) };
            await handleUpdateUser(updatedUser);

            setNewItem({ itemDescription: '', price: '', category: '', image: null });
            setShowSellForm(false);
            fetchCategories();
            fetchItems();
        } catch (error) {
            console.error("Error selling item:", error);
        }
    };

    const handleBuyItem = async (itemId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            const item = items.find(item => item.id === itemId);
            if (!item) return;

            const response = await fetch(`https://localhost:7002/api/item/buy/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to buy item");
            }
            const updatedUser = { ...user, balance: user.balance - item.price };
            await handleUpdateUser(updatedUser);
            fetchItems();
            fetchCategories(); // Fetch categories to ensure they are updated after buying an item
        } catch (error) {
            console.error("Error buying item:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFileChange = (e) => {
        setNewItem(prevState => ({ ...prevState, image: e.target.files[0] }));
    };

    return (
        <div className="home">
            <Navbar user={user} setUser={setUser} setShowSellForm={setShowSellForm} />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-3">
                        <h4>Categories</h4>
                        <FormGroup>
                            {categories.map(category => (
                                <FormControlLabel
                                    key={category}
                                    control={
                                        <Checkbox
                                            value={category}
                                            onChange={handleCategoryChange}
                                            color="primary"
                                        />
                                    }
                                    label={category}
                                />
                            ))}
                        </FormGroup>
                        <Button variant="contained" color="primary" onClick={handleFilterItems} sx={{ mt: 3 }}>
                            Filter Items
                        </Button>
                        <Button variant="contained" color="secondary" onClick={fetchItems} sx={{ mt: 3 }}>
                            Show All Items
                        </Button>
                    </div>
                    <div className="col-md-9">
                        <h4>Items</h4>
                        <div className="item-grid">
                            {items.map(item => (
                                <Card key={item.id} className="item-card">
                                    {item.image && (
                                        <CardMedia
                                            component="img"
                                            image={`data:image/jpeg;base64,${item.image}`}
                                            alt={item.itemDescription}
                                            className="card-media"
                                        />
                                    )}
                                    <CardContent className="card-content">
                                        <Typography variant="h5" component="div">
                                            {item.itemDescription}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Price: ${item.price.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button variant="contained" color="primary" onClick={() => handleBuyItem(item.id)}>
                                            Buy
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={showSellForm} onClose={() => setShowSellForm(false)}>
                <DialogTitle>Sell Item</DialogTitle>
                <DialogContent>
                    <form onSubmit={(e) => { e.preventDefault(); handleSellItem(); }}>
                        <TextField
                            margin="dense"
                            label="Item Description"
                            name="itemDescription"
                            value={newItem.itemDescription}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Price"
                            name="price"
                            type="number"
                            value={newItem.price}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Category"
                            name="category"
                            value={newItem.category}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <Button variant="contained" component="label">
                            Upload Image
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSellForm(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSellItem} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Footer />
        </div>
    );
}

export default Home;
