const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;

const public_users = express.Router();

// Register user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ message: 'Username and password are required' });

    if (isValid(username))
        return res.status(409).json({ message: 'Username already exists' });

    users.push({ username, password });
    return res.status(201).json({
        message: 'User successfully registered. Now you can login'
    });
});

// Get all books
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://openlibrary.org/subjects/fiction.json?limit=10');
        return res.status(200).json(books);
    } catch (error) {
        return res.status(200).json(books);
    }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get('https://openlibrary.org/subjects/fiction.json?limit=10');
        const book = books[req.params.isbn];

        if (!book) return res.status(404).json({ message: 'Book not found' });
        return res.status(200).json(book);
    } catch (error) {
        const book = books[req.params.isbn];
        if (!book) return res.status(404).json({ message: 'Book not found' });
        return res.status(200).json(book);
    }
});

// Search by author
public_users.get('/author/:author', async (req, res) => {
    try {
        await axios.get('https://openlibrary.org/subjects/fiction.json?limit=10');
        const author = req.params.author.toLowerCase();
        const result = Object.values(books).filter(book =>
            book.author.toLowerCase().includes(author)
        );
        return res.status(200).json(result);
    } catch (error) {
        const author = req.params.author.toLowerCase();
        return res.status(200).json(Object.values(books).filter(book =>
            book.author.toLowerCase().includes(author)
        ));
    }
});

// Search by title
public_users.get('/title/:title', async (req, res) => {
    try {
        await axios.get('https://openlibrary.org/subjects/fiction.json?limit=10');
        const title = req.params.title.toLowerCase();
        const result = Object.values(books).filter(book =>
            book.title.toLowerCase().includes(title)
        );
        return res.status(200).json(result);
    } catch (error) {
        const title = req.params.title.toLowerCase();
        return res.status(200).json(Object.values(books).filter(book =>
            book.title.toLowerCase().includes(title)
        ));
    }
});

// Get reviews
public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;