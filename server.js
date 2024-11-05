const express = require('express');
const app = express();
const PORT = 3000;

// Default Data Structure
const movies = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
];

// Middleware to parse JSON requests
app.use(express.json());

// Default Route
app.get('/', (req, res) => {
    const movieList = movies.map(movie => `<li>${movie.title} (${movie.year}) by ${movie.director}</li>`).join('');
    res.send(`<h1>Movie Collection</h1><ul>${movieList}</ul>`);
});

// CRUD Routes

// GET /movies: List all movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

// POST /movies: Add a new movie
app.post('/movies', (req, res) => {
    const newMovie = {
        id: movies.length + 1,
        title: req.body.title,
        director: req.body.director,
        year: req.body.year
    };
    movies.push(newMovie);
    res.status(201).json(newMovie);
});

// GET /movies/:id: Get a movie by its id
app.get('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = movies.find(m => m.id === movieId);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).json({ message: "Movie not found" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
