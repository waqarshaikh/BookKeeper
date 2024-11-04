const express = require('express');
const bodyParser = require('body-parser');
const { Parser } = require('json2csv');
const cors = require('cors');
const db = require('../db/db');

const app = express();
const PORT = process.env.PORT || 3001;

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

app.get('/api/books/filter', async (req, res) => {
    const { title, author, genre } = req.query;
    let query = 'SELECT * FROM Inventory WHERE 1=1';
    const params = [];

    if (title) {
        query += ' AND title LIKE ?';
        params.push(`%${title}%`);
    }
    if (author) {
        query += ' AND author LIKE ?';
        params.push(`%${author}%`);
    }
    if (genre) {
        query += ' AND genre = ?';
        params.push(genre);
    }

    try {
        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to retrieve books' });
    }
});

app.get('/api/books/export', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Inventory');
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(rows);

        res.header('Content-Type', 'text/csv');
        res.attachment('books_inventory.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting books:', error);
        res.status(500).json({ error: 'Failed to export books' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
