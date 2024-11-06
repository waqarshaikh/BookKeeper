CREATE TABLE Inventory
(
    entry_id         INT AUTO_INCREMENT PRIMARY KEY,
    title            VARCHAR(255)       NOT NULL,
    author           VARCHAR(255)       NOT NULL,
    genre            VARCHAR(100),
    publicationDate DATE,
    isbn             VARCHAR(20) UNIQUE NOT NULL
);
