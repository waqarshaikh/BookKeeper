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

app.post('/api/books', async (req, res) => {
    const { title, author, publication_date, genre, isbn } = req.body;
    try {
        const [result] = await db.query('INSERT INTO Inventory (title, author, publication_date, genre, isbn) VALUES (?, ?, ?, ?, ?)', [title, author, publication_date, genre, isbn]);
        res.status(201).json({ id: result.insertId, title, author, publication_date, genre, isbn });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Failed to add book' });
    }
});

module.exports = app;
