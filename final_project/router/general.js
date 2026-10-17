
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();
const BASE_URL = 'http://localhost:5000';

// ============================================================================
// Asynchronous Helper Functions (using Promises)
// ============================================================================

// Helper: Fetch all books using a Promise
const getAllBooksPromise = () => {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject(new Error('Unable to retrieve book list.'));
    }
  });
};

// Helper: Fetch book by ISBN using a Promise
const getBookByISBNPromise = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error('Book not found.'));
    }
  });
};

// Helper: Fetch books by author using a Promise
const getBooksByAuthorPromise = (author) => {
  return new Promise((resolve, reject) => {
    const targetAuthor = decodeURIComponent(author).toLowerCase();
    const matches = Object.values(books).filter(book =>
      book.author.toLowerCase().includes(targetAuthor)
    );
    resolve(matches);
  });
};

// Helper: Fetch books by title using a Promise
const getBooksByTitlePromise = (title) => {
  return new Promise((resolve, reject) => {
    const targetTitle = decodeURIComponent(title).toLowerCase();
    const matches = Object.values(books).filter(book =>
      book.title.toLowerCase().includes(targetTitle)
    );
    resolve(matches);
  });
};

// ============================================================================
// Route Handlers (Tasks 1 - 6 & Tasks 10 - 13)
// ============================================================================

// Task 6: Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required.'
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: 'Username already exists.'
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: 'User successfully registered. Now you can login.'
  });
});

// Task 1 & Task 10: Get all books using async/await
public_users.get('/', async (req, res) => {
  try {
    const bookList = await getAllBooksPromise();
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving books.', error: error.message });
  }
});

// Task 2 & Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  getBookByISBNPromise(isbn)
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ message: error.message }));
});

// Task 3 & Task 12: Get book details based on author using Promises
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;

  getBooksByAuthorPromise(author)
    .then((matches) => res.status(200).json(matches))
    .catch((error) => res.status(500).json({ message: 'Error retrieving books by author.', error: error.message }));
});

// Task 4 & Task 13: Get all books based on title using Promises / async-await
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;

  getBooksByTitlePromise(title)
    .then((matches) => res.status(200).json(matches))
    .catch((error) => res.status(500).json({ message: 'Error retrieving books by title.', error: error.message }));
});

// Task 5: Get reviews for a book based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  return res.status(200).json(book.reviews);
});

// ============================================================================
// Tasks 10 - 13: Standalone Axios Client Functions
// Demonstrates consuming the API using Axios with async/await and Promises
// ============================================================================

// Task 10: Get all books using async/await with Axios
async function getBooksWithAxios() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Axios Task 10 Error:', error.message);
    throw error;
  }
}

// Task 11: Get book details by ISBN using Promises with Axios (.then / .catch)
function getBookByISBNWithAxios(isbn) {
  return axios.get(`${BASE_URL}/isbn/${encodeURIComponent(isbn)}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Axios Task 11 Error:', error.message);
      throw error;
    });
}

// Task 12: Get book details by Author using Promises with Axios (.then / .catch)
function getBooksByAuthorWithAxios(author) {
  return axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Axios Task 12 Error:', error.message);
      throw error;
    });
}

// Task 13: Get book details by Title using async/await with Axios
async function getBooksByTitleWithAxios(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    console.error('Axios Task 13 Error:', error.message);
    throw error;
  }
}

module.exports = {
  general: public_users,
  getBooksWithAxios,
  getBookByISBNWithAxios,
  getBooksByAuthorWithAxios,
  getBooksByTitleWithAxios
};
