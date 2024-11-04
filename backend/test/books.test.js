const request = require('supertest');
const app = require('../src/index'); // Import your Express app

describe('GET api/books', () => {
    it('should return a list of books', async () => {
        const response = await request(app)
            .get('/api/books')  // Adjust the route to your get books endpoint
            .set('Accept', 'application/json');

        expect(response.status).toBe(200); // Check for success status
        expect(Array.isArray(response.body)).toBe(true); // Ensure the response body is an array
    });

    it('should return a list of books with the correct properties', async () => {
        const response = await request(app)
            .get('/api/books')  // Adjust the route to your get books endpoint
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

        expect(response.status).toBe(201); // Check for success status
        expect(response.body).toHaveProperty('id'); // Ensure the response contains an id
        expect(response.body.title).toBe(newBook.title); // Check that the title matches
    });
});

