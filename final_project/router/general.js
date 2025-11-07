const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ✅ Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully!" });
});

// ✅ Task 1: Get all books
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// ✅ Task 2: Get book by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.status(200).json(book);
  else return res.status(404).json({ message: "Book not found." });
});

// ✅ Task 3: Get books by author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );
  if (filteredBooks.length > 0) return res.status(200).json(filteredBooks);
  else
    return res.status(404).json({ message: "No books found for this author." });
});

// ✅ Task 4: Get books by title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );
  if (filteredBooks.length > 0) return res.status(200).json(filteredBooks);
  else
    return res.status(404).json({ message: "No books found with this title." });
});

// ✅ Task 5: Get reviews for a book
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) return res.status(200).json(book.reviews);
  else
    return res.status(404).json({ message: "No reviews found for this book." });
});

// --------------------------------------------------------
// ✅ Tasks 10–13 (Async/Await, Promises, Axios versions)
// --------------------------------------------------------

// Task 10: Get all books (async callback)
public_users.get("/async/books", async (req, res) => {
  try {
    const getBooks = async () => books;
    const data = await getBooks();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books." });
  }
});

// Task 11: Search by ISBN (Promises)
public_users.get("/async/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) resolve(book);
    else reject("Book not found");
  })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Search by Author (Axios)
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    const author = req.params.author.toLowerCase();
    const filteredBooks = Object.values(response.data).filter(
      (b) => b.author.toLowerCase() === author
    );
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author." });
  }
});

// Task 13: Search by Title (Axios + async)
public_users.get("/async/title/:title", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(response.data).filter(
      (b) => b.title.toLowerCase() === title
    );
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title." });
  }
});

module.exports.general = public_users;
