const request = require('supertest');
const app = require('../src/index');
const db = require('../db/db');

describe('GET /api/books', () => {
    beforeAll(async () => {
        await db.query('DELETE FROM Inventory');
        await db.query('INSERT INTO Inventory (title, author, publication_date, genre, isbn) VALUES (?, ?, ?, ?, ?)',
            ['The Great Gatsby', 'F. Scott Fitzgerald', '1925-04-10', 'Fiction', '9780743273565']);
        await db.query('INSERT INTO Inventory (title, author, publication_date, genre, isbn) VALUES (?, ?, ?, ?, ?)',
            ['1984', 'George Orwell', '1949-06-08', 'Dystopian', '9780451524935']);
    });

    afterAll(async () => {
        await db.query('DELETE FROM Inventory');
    });

    it('should filter books by title', async () => {
        const response = await request(app)
            .get('/api/books/filter?title=The Great Gatsby')
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe('The Great Gatsby');
    });

    it('should filter books by author', async () => {
        const response = await request(app)
            .get('/api/books/filter?author=George Orwell')
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].author).toBe('George Orwell');
    });

    it('should filter books by genre', async () => {
        const response = await request(app)
            .get('/api/books/filter?genre=Fiction')
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].genre).toBe('Fiction');
    });

    it('should return an empty array when no books match the filter', async () => {
        const response = await request(app)
            .get('/api/books/filter?title=Non-existent Book')
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });
});
