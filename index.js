const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const path = require('path');
let users = []
let books = require('./router/booksdb.js');

//Function to check if the user exists
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}
//Function to check if the user is authenticated
const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

const app = express();

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if(req.session.authorization) { //get the authorization object stored in the session
    token = req.session.authorization['accessToken']; //retrieve the token from authorization object
    jwt.verify(token, "access",(err,user)=>{ //Use JWT to verify token
        if(!err){
            req.user = user;
            next();
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
});
 
const PORT = 5000; // Serve both frontend and backend on 5000

app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Backend API endpoint for books
app.get('/books', (req, res) => {
  res.json(books);
});

// Always serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT,()=>console.log("Server is running on port 5000"));
