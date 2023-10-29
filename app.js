const express = require('express');
const path = require("path")
const app = express();
const cors = require('cors');
const mongo = require("mongoose");
const User = require("./db/user");
const bodyParser = require("body-parser");
const hbsHelpers = require("./helpers");
const db = require("./mongodb");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require('dotenv').config();
const todoRouter = require("./todo/todo_router");
const middleware = require("./todo/todo_middleware");
const PORT = 4500;

db();

const sessOption = {
  secret: process.env.SESSION_SECRET,
  // proxy: true,
  cookie: {
    // sameSite: "none",
    secure: false,
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000, //3 days
  },
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: "native",
    // db: 'myappsession',
    // clear_interval: 3600
  }),
};


const corsOptions = {
  origin: ["http://localhost:4500"],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  // methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
  // exposedHeaders: ["set-cookie"]
};

app.use(cors(corsOptions));

app.use(session(sessOption));


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "src")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/todo.hbs", todoRouter);

app.set("view engine", "hbs");
app.set("views",  path.join(__dirname, "views"))

app.get("/", (req, res) => {
  res.render("index", { pageTitle: "To Do app"});
});

app.get("/index.hbs", (req, res) => {
  res.status(200);
  res.render("index");
});

app.get("/login.hbs", (req, res) => {
  res.status(404);
  res.render("login");
});

app.get("/signup.hbs", (req, res) => {
  res.status(404);
  res.render("signup");
  
});

app.get("/todo.hbs", (req, res) => {
  res.status(404).render("todo.hbs");
});

app.get('/public/index.css', (req, res) => {
  res.header('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'public', 'index.css'));
});

app.post("/login", async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
    try{
    
    if (!name || !password) {
      alert("Please enter your name and password");
      res.status(401).redirect("/login.hbs");
    }
      const user = await User.findOne({ name: name });
      console.log(user);
      if (!user) {
        alert("User not found");
        res.status(401).redirect("/signup.hbs");
      }
      if (user.password !== password) {
        alert("Incorrect password");
        res.status(401).redirect("/login.hbs");
  }
      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "400h",
      });
      req.session.token = token;
      console.log(req.session.token);
        res.status(200).redirect("/todo.hbs");
    }
  catch(error){
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/signup", async (req, res) => {
  try {
    const name = req.body.name;
    const password = req.body.password;

    const user = new User({
      name: name,
      password: password
    });
    await user.save();
    res.status(200).redirect("/todo.hbs");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use((req, res, next) => {
    res.status(404).send("404 Not Found");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
    console.log(`Server is running succesfully on ${PORT}`);
});

