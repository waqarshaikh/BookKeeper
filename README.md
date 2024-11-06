# BookKeeper

BookKeeper is a simple inventory management system for books, allowing users to add, filter, and export book data.

## Features

- Add new books to the inventory
- Edit existing book details
- Delete books from the inventory
- Filter books by title, author, genre, and publication date
- Export book data to a CSV file

## Technologies Used

- **Frontend**: Angular, TypeScript, HTML, CSS
- **Backend**: Node.js, Express.js, MySQL
- **Database**: MySQL
- **Testing**: Jest, Supertest

## Getting Started

### Prerequisites

- Node.js
- npm
- MySQL

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/waqarshaikh/BookKeeper.git
    cd BookKeeper
    ```

2. Set up the backend:

    ```bash
    cd backend
    npm install
    ```

3. Set up the frontend:

    ```bash
    cd ../frontend/bookkeeper-ui
    npm install
    ```

4. Configure the MySQL database:

    - Create a MySQL database named `bookkeeper`.
    - Update the database configuration in `backend/db/db.js` with your MySQL credentials.

5. Run the backend server:

    ```bash
    cd backend
    npm start
    ```

6. Run the frontend server:

    ```bash
    cd ../frontend/bookkeeper-ui
    npm start
    ```

7. Open your browser and navigate to `http://localhost:4200`.

## API Endpoints

### Books

- `GET /api/books`: Retrieve all books
- `POST /api/books`: Add a new book
- `PUT /api/books/:id`: Update an existing book
- `DELETE /api/books/:id`: Delete a book
- `GET /api/books/:id`: Retrieve a book by ID
- `GET /api/books/filter`: Filter books by title, author, genre, and publication date
- `GET /api/books/export`: Export books to a CSV file

## Running Tests

To run the backend tests:

```bash
cd backend
npm test
```
