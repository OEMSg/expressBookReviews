const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    // Extract username and password from the request body
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        // Note: Assuming isValid(username) returns true if the user exists
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }

    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
    try {
        // Simulating an asynchronous operation (like fetching from an external API or database)
        const getBooks = new Promise((resolve, reject) => {
            resolve(books);
        });

        // Wait for the promise to resolve
        const fetchedBooks = await getBooks;

        // Send JSON response with formatted books data
        return res.status(200).send(JSON.stringify(fetchedBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;

    // Send the corresponding book's details
    return res.status(200).send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Retrieve the author from the request parameters
    const requestedAuthor = req.params.author;

    // Obtain all the keys for the 'books' object
    const bookKeys = Object.keys(books);

    // Create an array to hold any matching books
    let matchingBooks = [];

    // Iterate through the keys to check the author of each book
    for (let i = 0; i < bookKeys.length; i++) {
        const isbn = bookKeys[i];
        if (books[isbn].author === requestedAuthor) {
            matchingBooks.push(books[isbn]);
        }
    }

    // Send the response
    if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
        return res.status(404).json({ message: "No books found for the provided author." });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Retrieve the title from the request parameters
    const requestedTitle = req.params.title;

    // Obtain all the keys for the 'books' object
    const bookKeys = Object.keys(books);

    // Create an array to hold any matching books
    let matchingBooks = [];

    // Iterate through the keys to check the title of each book
    for (let i = 0; i < bookKeys.length; i++) {
        const isbn = bookKeys[i];
        if (books[isbn].title === requestedTitle) {
            matchingBooks.push(books[isbn]);
        }
    }

    // Send the response
    if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
        return res.status(404).json({ message: "No books found for the provided title." });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;

    // Access the book using the ISBN, then access its reviews
    const book = books[isbn];

    // Send the response
    if (book) {
        return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.general = public_users;
