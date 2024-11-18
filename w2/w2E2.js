const express = require('express');
const app = express();
const PORT = 3000;

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

// Helper function for validation
const validateMovie = (title, director, year) => {
    const currentYear = new Date().getFullYear();
    let errors = [];

    if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.push("Title is required and should be a non-empty string.");
    }

    if (!director || typeof director !== 'string' || director.trim() === '') {
        errors.push("Director is required and should be a non-empty string.");
    }

    if (typeof year !== 'number' || year < 1888 || year > currentYear) {
        errors.push(`Year is required and should be a number between 1888 and ${currentYear}.`);
    }

    return errors;
};

// CRUD Routes

// GET /movies: List all movies
app.get('/movies', (req, res) => {
    res.json(movies);
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

// POST /movies: Add a new movie
app.post('/movies', (req, res) => {
    const { title, director, year } = req.body;

    // Validate input
    const errors = validateMovie(title, director, year);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const newMovie = {
        id: movies.length + 1,
        title,
        director,
        year
    };
    movies.push(newMovie);
    res.status(201).json(newMovie); // 201 Created
});

// PUT /movies/:id: Update the details of an existing movie
app.put('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = movies.find(m => m.id === movieId);

    if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
    }

    const { title, director, year } = req.body;

    // Validate input
    const errors = validateMovie(title, director, year);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Update movie details
    movie.title = title;
    movie.director = director;
    movie.year = year;

    res.json(movie); // Return the updated movie
});

// DELETE /movies/:id: Delete a movie by its ID
app.delete('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === movieId);

    if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie not found" });
    }

    // Remove the movie from the array
    movies.splice(movieIndex, 1);

    res.status(204).send(); // 204 No Content
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
