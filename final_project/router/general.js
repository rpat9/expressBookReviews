const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const fetchBooks = async () => {

  try {

    return new Promise((resolve) => {

      setTimeout(() => {
        resolve(books);
      }, 100)

    });

  } catch (err) {
    throw new Error("Failed to fetch books from API");
  }
}


const fetchBooksByISBN = async (isbn) => {

  try {

    return new Promise((resolve, reject) => {

      setTimeout(() => {
        books[isbn] ? resolve(books[isbn]) : reject(new Error("No book found"));
      }, 100);
      
    });

  } catch (err) {
    throw new Error("Failed to fetch book from API");
  }
}


const fetchBooksByAuthor = async (author) => {

  try {

    return new Promise((resolve, reject) => {

      setTimeout(() => {
        const bookKeys = Object.keys(books);
        let matchingBooks = [];

        bookKeys.forEach(key => {

          if(books[key].author.toLowerCase() === author.toLowerCase()){
            matchingBooks.push(books[key])
          }

        });

        matchingBooks.length > 0 ? resolve(matchingBooks) : reject(new Error("No books found for this author"))
      }, 100);

    });

  } catch (err) {
    throw new Error("Failed to fetch books by author from API");
  }
}


const fetchBookByTitle = async (title) => {

  try {

      return new Promise((resolve, reject) => {

          setTimeout(() => {
              const bookKeys = Object.keys(books);
              const matchingKey = bookKeys.find(key => 
                  books[key].title.toLowerCase() === title.toLowerCase()
              );

              matchingKey ? resolve(books[matchingKey]) :  reject(new Error('Book not found'));

          }, 100);
      });

  } catch (error) {
      throw new Error('Failed to fetch book by title from API');
  }
};


public_users.post("/register", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users.find(user => user.username === username)) {
    return res.status(400).json({message: "Username already exists"});
  }

  users.push({username: username, password: password});

  return res.status(200).json({message: "User registered successfully"});

});


public_users.get('/', async (req, res) => {

  try {

    const allBooks = await fetchBooks();

    res.status(200).json({
      message: "Books retrived successfully",
      books: allBooks
    });

  } catch (err) {

    res.status(500).json({
      message: "Error retrieving books",
      error: err.message
    });
  }
});


public_users.get('/isbn/:isbn',async (req, res) => {

  try{

    const isbn = req.params.isbn;

    const book = await fetchBooksByISBN(isbn);

    res.status(200).json({
      message: "Book retrived successfully",
      book: book
    });
  
  } catch(err) {

    res.status(404).json({
      message: "Book not found",
      error: err.message
    });
  }
});


public_users.get('/author/:author', async (req, res) => {

  try {

    const author = req.params.author;

    const books = await fetchBooksByAuthor(author);

    res.status(200).json({
      message: "Books retrived successfully",
      books: books
    });

  } catch(err) {

    res.status(404).json({
      message: "Book not found",
      error: err.message
    });
  }
});


public_users.get('/title/:title', async (req, res) => {
  
  try {

    const title = req.params.title;

    const book = await fetchBookByTitle(title);

    res.status(200).json({
      message: "Book retrived successfully",
      book: book
    });

  } catch(err) {

    res.status(404).json({
      message: "Book not found",
      error: err.message
    });
  }

});


public_users.get('/review/:isbn',function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews), null, 4);
  } else {
    return res.status(404).json({ message: "ISBN not found" });
  }

});

module.exports.general = public_users;