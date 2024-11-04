const request = require('supertest');
const app = require('../src/index');
const db = require("../db/db");

describe('GET api/books', () => {
    beforeAll(async () => {
        await db.query('DELETE FROM Inventory');
        await db.query('INSERT INTO Inventory (title, author, publication_date, genre, isbn) VALUES (?, ?, ?, ?, ?)',
            ['Test Book', 'Test Author', '2024-01-01', 'Test Genre', '1234567890']);
    });

    it('should return a list of books', async () => {
        const response = await request(app)
            .get('/api/books')
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return a list of books with the correct properties', async () => {
        const response = await request(app)
            .get('/api/books')
            .set('Accept', 'application/json');
        console.log(response.body);
        const book = response.body[0];
        expect(book).toHaveProperty('entry_id');
        expect(book).toHaveProperty('title');
        expect(book).toHaveProperty('author');
        expect(book).toHaveProperty('publication_date');
        expect(book).toHaveProperty('genre');
        expect(book).toHaveProperty('isbn');
    });
});

describe('POST api/books', () => {
    beforeAll(async () => {
        await db.query('DELETE FROM Inventory');
    });

    afterAll(async () => {
        await db.query('DELETE FROM Inventory');
    });


    it('should add a new book and return it', async () => {
        const newBook = {
            title: 'New Book Title',
            author: 'New Author',
            publication_date: '2024-01-01',
            genre: 'Fiction',
            isbn: '1234567890'
        };

        const response = await request(app)
            .post('/api/books')
            .send(newBook)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newBook.title);
        expect(response.body.author).toBe(newBook.author);
        expect(response.body.publication_date).toBe(newBook.publication_date);
        expect(response.body.genre).toBe(newBook.genre);
        expect(response.body.isbn).toBe(newBook.isbn);
    });
});

