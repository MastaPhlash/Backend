const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  return (userswithsamename.length > 0);

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  return (validusers.length > 0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  // Prevent login if user is not registered
  if (!isValid(username)) {
      return res.status(401).json({message: "User not registered"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 4000 });
    req.session.authorization = {
      accessToken,
      username // always set username here
    }
    req.session.save(() => { // ensure session is saved before responding
      return res.status(200).send("User successfully logged in");
    });
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Logout endpoint to destroy session
regd_users.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({message: "Logged out"});
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization && req.session.authorization.username;
  if (!username) {
    return res.status(401).json({message: "Not logged in"});
  }
  if (books[isbn]) {
      let book = books[isbn];
      book.reviews[username] = review;
      return res.status(200).send("Review successfully posted");
  }
  else {
      return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization && req.session.authorization.username;
    if (!username) {
      return res.status(401).json({message: "Not logged in"});
    }
    if (books[isbn]) {
        let book = books[isbn];
        delete book.reviews[username];
        return res.status(200).send("Review successfully deleted");
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
});

users.push({ username: "testuser", password: "testpass" });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
