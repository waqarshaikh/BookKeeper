const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../db/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/api/books', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Inventory');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to retrieve books' });
    }
});

module.exports = app;
