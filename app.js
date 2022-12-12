require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 3000;

const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

/* Home page route */
app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

// the public routes

/* movies GET routes */
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

/* users GET routes */
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

/* login route */
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
/* create users */
app.post("/api/users", hashPassword, userHandlers.postUser);

// the private routes

app.use(verifyToken); // <= the authentification wall

/* movies POST, PUT, DELETE routes */
app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

/* users PUT, DELETE routes */
app.put("/api/users/:id", userHandlers.updateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
