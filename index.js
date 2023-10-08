//const { authenticator } = require('otplib');
const express = require("express");
const rateLimit = require('express-rate-limit');
const path = require("path");
const app = express();
const port = 3306;
const dotenv = require('dotenv');
dotenv.config();
//const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';



app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const database = require("./database/database.js"); 


app.use('/', express.static(path.join(__dirname, 'public', 'login')));
app.use('/signup', express.static(path.join(__dirname, 'public', 'signup')));
const loginlimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  delayMs: 5000,
  message: "Too many login attempts from this IP, please try again later"
});

app.use((req, res, next) => {
  res.setHeader(
      'Strict-Transport-Security',
  'max-age=15552000; includeSubDomains'
  );
  next();
  });

app.post('/login', loginlimiter, (req, res) => {
  const { username, password } = req.body;
  const user = {
    username : username,
    password : password
  }
  

  database.authenticate(user)
  .then((result) => {
    if(result){
  //     const totp = authenticator.generate(secret);
  // const isVerified = authenticator.verify({ token: totp, secret });
  
  // if(isVerified){ 
      res.json(result);
    }
    else{
      res.redirect('/?error=true');
    }
  }
  )
});

app.post('/submitSignup', (req, res) => {
  const { username, password } = req.body;
  const user = {
    username : username,
    password : password
  }

  
  


  database.signup(user)
  .then((result) => {
    if(result){
      res.json("user created! please login");
    }
    else{
      res.redirect('/signup?error=true');
    }
  }
  )
});

app.listen(process.env.PORT||port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

