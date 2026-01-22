require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const app = express(); // vs express.Router() ?
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

function createToken(user) {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

function authRequired(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Lipseste token-ul.' });
    }

    const token = header.substring('Bearer '.length);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalid sau expirat.' });
    }
}


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

app.get("/api/config", (req, res) => {
  res.json({ googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "" });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email si parola sunt obligatorii.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Parola trebuie sa aiba minim 6 caractere.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name: name || null,
                passwordHash,
            },
            select: { id: true, email: true, name: true },
        });

        const token = createToken(user);

        return res.status(201).json({ token, user });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Exista deja un cont cu acest email.' });
        }

        console.error('Eroare la inregistrare:', error);
        return res.status(500).json({ error: 'Eroare server' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email si parola sunt obligatorii.' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Email sau parola incorecte.' });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ error: 'Email sau parola incorecte.' });
        }

        const token = createToken({ id: user.id, email: user.email });

        return res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        console.error('Eroare la autentificare:', error);
        return res.status(500).json({ error: 'Eroare server' });
    }
});

app.use('/api/restaurants', authRequired);

app.get('/api/restaurants', async (req, res) => {
    try {
        const restaurants = await prisma.restaurant.findMany({
            where: {
                ownerId: req.user.userId
            }
        });
        res.json(restaurants);
    } catch (error) {
        console.error('Eroare la obtinerea restaurantelor:', error);
        res.status(500).json({ error: 'Eroare server' });
    }
});


app.get('/api/restaurants/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID invalid" });
    }

        const restaurant = await prisma.restaurant.findFirst({
            where: {
                id: id,
                ownerId: req.user.userId,
            },
        });

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurantul nu a fost gasit.' });
        }

        return res.json(restaurant);
    } catch (error) {
        console.error('Eroare la obtinerea restaurantului dupa ID:', error);
        return res.status(500).json({ error: 'Eroare server' });
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
      return res
        .status(400)
        .json({ error: "Numele si adresa sunt obligatorii" });
    }

    const { latitude, longitude } = await geocodeAddress(address);

        const updatedRestaurant = await prisma.restaurant.update({
            where: {
                id: id,
                ownerId: req.user.userId,
            },
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

        console.error('Eroare la actualizarea restaurantului:', error);
        res.status(500).json({ error: 'Eroare server' });
    }
});

app.delete('/api/restaurants/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID invalid' });
        }
        await prisma.restaurant.delete({
            where: {
                id: id,
                ownerId: req.user.userId,
            }
        });
        res.status(204).send();

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Restaurantul nu a fost gasit.' });
        }
        console.error('Eroare la stergerea restaurantului:', error);
        res.status(500).json({ error: 'Eroare server' });
    }
});

app.post("/api/restaurants", async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res
        .status(400)
        .json({ error: "Numele si adresa sunt obligatorii" });
    }

        const { latitude, longitude } = await geocodeAddress(address);

        const newRestaurant = await prisma.restaurant.create({
            data: {
                name,
                address,
                latitude,
                longitude,
                ownerId: req.user.userId, // <-- asta e cheia (userul logat)
            },
        });

        return res.status(201).json({ restaurant: newRestaurant });

    } catch (error) {
        console.error('Eroare la crearea restaurantului:', error);
        return res.status(500).json({ error: 'Eroare server' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
