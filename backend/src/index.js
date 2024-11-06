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
    const { title, author, publicationDate, genre, isbn } = req.body;
    try {
        const date = new Date(publicationDate);
        const formattedDate = date.toISOString().split('T')[0];
        const [result] = await db.query('INSERT INTO Inventory (title, author, publicationDate, genre, isbn) VALUES (?, ?, ?, ?, ?)', [title, author, formattedDate, genre, isbn]);
        res.status(201).json({ id: result.insertId, title, author, publicationDate: formattedDate, genre, isbn });
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

app.put('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, publicationDate, genre, isbn } = req.body;

    try {
        const date = new Date(publicationDate);
        const formattedDate = date.toISOString().split('T')[0];
        await db.query('UPDATE Inventory SET title = ?, author = ?, publicationDate = ?, genre = ?, isbn = ? WHERE entry_id = ?',
            [title, author, formattedDate, genre, isbn, id]);
        const [updatedBook] = await db.query('SELECT * FROM Inventory WHERE entry_id = ?', [id]);
        updatedBook[0].publicationDate = updatedBook[0].publicationDate.toISOString().split('T')[0];
        res.status(200).json(updatedBook[0]);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Failed to update book' });
    }
});

app.delete('/api/books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM Inventory WHERE entry_id = ?', [id]);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

app.get('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Inventory WHERE entry_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ error: 'Failed to retrieve book' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
