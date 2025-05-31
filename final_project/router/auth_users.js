const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];


const isValid = (username)=>{

  return users.some(user => user.username === username);

}


const authenticatedUser = (username, password) => {

  const user = users.find(user => user.username === username);

  if (user && user.password === password) {

    return true;

  }

  return false;

}


regd_users.post("/login", (req, res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {

    return res.status(404).json({ message: "Username and password are required" });

  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "Invalid Username" });
  }

  if(!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  let accessToken = jwt.sign({

    data: username

  }, 'access', { expiresIn: 60*60 });

  req.session.authorization = {
    accessToken
  }

  return res.status(200).json({ message: "User successfully logged in", token: accessToken });

});


regd_users.put("/auth/review/:isbn", (req, res) => {
  
  const isbn = req.params.isbn;
  const review = req.query.review || req.body.review;

  if(!review) {

    return res.status(400).json({ message: "Review is required"});

  }

  if(!books[isbn]) {

    return res.status(404).json({ message: "Book not found" });

  }

  const username = req.user.data;

  books[isbn].reviews[username] = review;

  return res.status(200).json({

    message: "Review added/modified successfully",

    reviews: books[isbn].reviews

  });

});


regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;

  if(!books[isbn]) {

    return res.status(404).json({ message: "Book not found" });

  }

  const username = req.user.data;

  if(!books[isbn].reviews[username]){

    return res.status(401).json({ message: "No review found to delete" });

  }


  delete books[isbn].reviews[username];

  return res.status(200).json({

    message: "Review deleted successfully",

    reviews: books[isbn].reviews
    
  });
  
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;