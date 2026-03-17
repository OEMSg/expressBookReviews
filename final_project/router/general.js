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

// Task 11: Get book details based on ISBN using async-await and Promises
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        // Create a promise that fetches the book by ISBN
        const getBookByISBN = new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found"));
            }
        });

        // Wait for the promise to resolve
        const fetchedBook = await getBookByISBN;

        // Send the corresponding book's details
        return res.status(200).send(JSON.stringify(fetchedBook, null, 4));
    } catch (error) {
        // Catch any errors (like the book not being found)
        return res.status(404).json({ message: error.message });
    }
});

// Task 12: Get book details based on author using async-await and Promises
public_users.get('/author/:author', async function (req, res) {
    const requestedAuthor = req.params.author;

    try {
        // Create a promise that searches for books by author
        const getBooksByAuthor = new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            let matchingBooks = [];

            // Iterate through the keys to find matches
            for (let i = 0; i < bookKeys.length; i++) {
                const isbn = bookKeys[i];
                if (books[isbn].author === requestedAuthor) {
                    matchingBooks.push(books[isbn]);
                }
            }

            // Resolve if books are found, otherwise reject
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("No books found for the provided author."));
            }
        });

        // Wait for the promise to resolve
        const fetchedBooks = await getBooksByAuthor;

        // Send the matching books as a response
        return res.status(200).send(JSON.stringify(fetchedBooks, null, 4));
    } catch (error) {
        // Catch the rejection if no books are found
        return res.status(404).json({ message: error.message });
    }
});

// Task 13: Get book details based on title using async-await and Promises
public_users.get('/title/:title', async function (req, res) {
    const requestedTitle = req.params.title;

    try {
        // Create a promise that searches for books by title
        const getBooksByTitle = new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            let matchingBooks = [];

            // Iterate through the keys to find matches
            for (let i = 0; i < bookKeys.length; i++) {
                const isbn = bookKeys[i];
                if (books[isbn].title === requestedTitle) {
                    matchingBooks.push(books[isbn]);
                }
            }

            // Resolve if books are found, otherwise reject
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error("No books found for the provided title."));
            }
        });

        // Wait for the promise to resolve
        const fetchedBooks = await getBooksByTitle;

        // Send the matching books as a response
        return res.status(200).send(JSON.stringify(fetchedBooks, null, 4));
    } catch (error) {
        // Catch the rejection if no books are found
        return res.status(404).json({ message: error.message });
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
