const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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

  res.send(JSON.stringify(books, null, 4));

});


public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {

    res.send(JSON.stringify(books[isbn], null, 4));

  } else {

    return res.status(404).json({ message: "Book not found" });

  }

});


public_users.get('/author/:author',function (req, res) {

  const author = req.params.author;
  const bookKeys = Object.keys(books);

  let matchingBooks = [];

  bookKeys.forEach(key => {

    if (books[key].author.toLowerCase() === author.toLowerCase()) {

      matchingBooks.push(books[key])

    }

  });

  if(matchingBooks.length > 0) {

    res.send(JSON.stringify(matchingBooks, null, 4));

  } else {

    return res.status(404).json({ message: "No books found for this author"});

  }

});


public_users.get('/title/:title',function (req, res) {
  
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  
  const matchingBook = bookKeys.find(key => 
    books[key].title.toLowerCase() === title.toLowerCase()
  );

  if (matchingBook) {

    res.send(JSON.stringify(books[matchingBook], null, 4));

  } else {

    return res.status(404).json({ message: "No books match the title" });

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