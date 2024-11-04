const request = require('supertest');
const app = require('../src/index');
const db = require('../db/db');

describe('GET /api/books/export', () => {
    beforeAll(async () => {
        await db.query('INSERT INTO Inventory (title, author, publication_date, genre, isbn) VALUES (?, ?, ?, ?, ?)',
            ['The Great Gatsby', 'F. Scott Fitzgerald', '1925-04-10', 'Fiction', '9780743273565']);
        await db.query('INSERT INTO Inventory (title, author, publication_date, genre, isbn) VALUES (?, ?, ?, ?, ?)',
            ['1984', 'George Orwell', '1949-06-08', 'Dystopian', '9780451524935']);
    });

    afterAll(async () => {
        await db.query('DELETE FROM Inventory');
    });

    it('should export the book inventory data as CSV', async () => {
        const response = await request(app)
            .get('/api/books/export')
            .set('Accept', 'text/csv');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/text\/csv/);
        expect(response.headers['content-disposition']).toMatch(/attachment; filename="books_inventory.csv"/);

        const csvContent = response.text;
        expect(csvContent).toContain('The Great Gatsby');
        expect(csvContent).toContain('F. Scott Fitzgerald');
        expect(csvContent).toContain('1984');
        expect(csvContent).toContain('George Orwell');
    });
});
