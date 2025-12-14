const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const app = express();  // vs express.Router() ?
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

async function geocodeAddress(address) {
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
    );

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }

    return { latitude: null, longitude: null };
  } catch (error) {
    console.error('Eroare geocoding:', error);
    return { latitude: null, longitude: null };
  }
}

app.get('/api/config', (req, res) => {
    res.json({ googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/restaurants', async (req, res) => {
    try {
        const restaurants = await prisma.restaurant.findMany();
        res.json(restaurants)
    } catch (error) {
        console.error('Error getting restaurants:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/restaurants/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID invalid' });
        }

        const restaurant = await prisma.restaurant.findUnique({
            where: { id }
        })
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.json(restaurant);
    }
    catch (error) {
        console.error('Error getting restaurant by ID:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/restaurants/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, address } = req.body;
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID invalid' });
        }

        if (!name || !address) {
            return res.status(400).json({ error: 'Numele si adresa sunt obligatorii' });
        }

        const { latitude, longitude } = await geocodeAddress(address);

        const updatedRestaurant = await prisma.restaurant.update({
            where: { id },
            data: { 
                name, 
                address, 
                latitude, 
                longitude 
            }
        });
        res.json({ restaurant: updatedRestaurant });
    } catch (error) {

        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Restaurantul nu a fost gasit.' });
        }

        console.error('Error updating restaurant:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/restaurants/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID invalid' });
        }
        await prisma.restaurant.delete({
            where: { id }
        });
        res.status(204).send();

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Restaurantul nu a fost gasit.' });
        }
        console.error('Error deleting restaurant:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/restaurants', async (req, res) => {
    try {
        const { name, address } = req.body;

        if (!name || !address) {
            return res.status(400).json({ error: 'Numele si adresa sunt obligatorii' });
        }

        const { latitude, longitude } = await geocodeAddress(address);

        let user = await prisma.user.findFirst();
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: 'gica@test.ro',
                    name: 'Gica Mecali',
                    passwordHash: 'not_secure_hash',

                }
            });
        }

        const newRestaurant = await prisma.restaurant.create({
            data: {
                name,
                address,
                latitude,
                longitude,
                ownerId: user.id
            }
        });

        res.status(201).json({ restaurant: newRestaurant });

    } catch (error) {
        console.error('Error creating restaurant:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

