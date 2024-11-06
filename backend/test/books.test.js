const request = require('supertest');
const app = require('../src/index');
const db = require("../db/db");

describe('GET api/books', () => {
    beforeAll(async () => {
        await db.query('DELETE FROM Inventory');
        await db.query('INSERT INTO Inventory (title, author, publicationDate, genre, isbn) VALUES (?, ?, ?, ?, ?)',
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
        expect(book).toHaveProperty('publicationDate');
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
            publicationDate: '2024-01-01',
            genre: 'Fiction',
            isbn: '986754321'
        };

        const response = await request(app)
            .post('/api/books')
            .send(newBook)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newBook.title);
        expect(response.body.author).toBe(newBook.author);
        expect(response.body.publicationDate).toBe(newBook.publicationDate);
        expect(response.body.genre).toBe(newBook.genre);
        expect(response.body.isbn).toBe(newBook.isbn);
    });
});

describe('PUT api/books/:id', () => {
    let entryId;

    beforeAll(async () => {
        const [result] = await db.query('INSERT INTO Inventory (title, author, publicationDate, genre, isbn) VALUES (?, ?, ?, ?, ?)',
            ['Update Test Book', 'Update Test Author', '2024-01-01', 'Update Test Genre', '1234567890']);
        entryId = result.insertId;
    });

    afterAll(async () => {
        await db.query('DELETE FROM Inventory WHERE entry_id = ?', [entryId]);
    });

    it('should update an existing book and return it', async () => {
        const updatedBook = {
            title: 'Updated Book Title',
            author: 'Updated Author',
            publicationDate: '2024-01-01',
            genre: 'Updated Genre',
            isbn: '0987654321'
        };

        const response = await request(app)
            .put(`/api/books/${entryId}`)
            .send(updatedBook)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedBook.title);
        expect(response.body.author).toBe(updatedBook.author);
        expect(response.body.publicationDate.split('T')[0]).toBe(updatedBook.publicationDate);
        expect(response.body.genre).toBe(updatedBook.genre);
        expect(response.body.isbn).toBe(updatedBook.isbn);
    });
});

describe('DELETE api/books/:id', () => {
    let entryId;

    beforeAll(async () => {
        const [result] = await db.query('INSERT INTO Inventory (title, author, publicationDate, genre, isbn) VALUES (?, ?, ?, ?, ?)',
            ['Delete Test Book', 'Delete Test Author', '2024-01-01', 'Delete Test Genre', '987654321']);
        entryId = result.insertId;
    });

    afterAll(async () => {
        await db.query('DELETE FROM Inventory WHERE entry_id = ?', [entryId]);
    });

    it('should delete an existing book', async () => {
        const response = await request(app)
            .delete(`/api/books/${entryId}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Book deleted successfully');
    });
});

describe('GET api/books/:id', () => {
    let entryId;

    beforeAll(async () => {
        const [result] = await db.query('INSERT INTO Inventory (title, author, publicationDate, genre, isbn) VALUES (?, ?, ?, ?, ?)',
            ['Get Test Book', 'Get Test Author', '2024-01-01', 'Get Test Genre', '1234567890']);
        entryId = result.insertId;
    });

    afterAll(async () => {
        await db.query('DELETE FROM Inventory WHERE entry_id = ?', [entryId]);
    });

    it('should return a book by id', async () => {
        const response = await request(app)
            .get(`/api/books/${entryId}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('entry_id', entryId);
        expect(response.body).toHaveProperty('title', 'Get Test Book');
        expect(response.body).toHaveProperty('author', 'Get Test Author');
        expect(response.body.publicationDate.split('T')[0]).toBe('2024-01-01');
        expect(response.body).toHaveProperty('genre', 'Get Test Genre');
        expect(response.body).toHaveProperty('isbn', '1234567890');
    });
});

