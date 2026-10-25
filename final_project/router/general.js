const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;

const public_users = express.Router();

const BASE_URL = 'http://localhost:5000';

// Register user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    users.push({ username, password });

    return res.status(201).json({
        message: 'User successfully registered. Now you can login'
    });
});

// Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
});

// Search books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();

    const result = Object.values(books).filter(book =>
        book.author.toLowerCase().includes(author)
    );

    return res.status(200).json(result);
});

// Search books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    const result = Object.values(books).filter(book =>
        book.title.toLowerCase().includes(title)
    );

    return res.status(200).json(result);
});

// Get reviews
public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book.reviews);
});

// Axios helper: get all books
async function getAllBooks() {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        return response.data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Axios helper: get book by ISBN
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(
            `${BASE_URL}/isbn/${encodeURIComponent(isbn)}`
        );
        return response.data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Axios helper: get books by author
function getBooksByAuthor(author) {
    return axios.get(
        `${BASE_URL}/author/${encodeURIComponent(author)}`
    )
        .then(response => response.data)
        .catch(error => {
            console.error(error.message);
            return null;
        });
}

// Axios helper: get books by title
function getBooksByTitle(title) {
    return axios.get(
        `${BASE_URL}/title/${encodeURIComponent(title)}`
    )
        .then(response => response.data)
        .catch(error => {
            console.error(error.message);
            return null;
        });
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;