const request = require('supertest');
const app = require('../src/index');

describe('GET api/books', () => {
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

        const book = response.body[0];
        expect(book).toHaveProperty('entry_id');
        expect(book).toHaveProperty('title');
        expect(book).toHaveProperty('author');
        expect(book).toHaveProperty('publication_date');
        expect(book).toHaveProperty('genre');
    });
});

describe('POST api/books', () => {
    it('should add a new book and return it', async () => {
        const newBook = {
            title: 'New Book Title',
            author: 'New Author',
            publication_date: '2024-01-01',
            genre: 'Fiction',
        };

        const response = await request(app)
            .post('/api/books')
            .send(newBook)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newBook.title);
    });
});

