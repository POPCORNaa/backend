const express = require('express');
const app = express();
const PORT = 3000;

// Enhanced movie data with more examples for better testing
const movies = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010, genre: "Sci-Fi", rating: 8.8 },
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999, genre: "Sci-Fi", rating: 8.7 },
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019, genre: "Drama", rating: 8.6 },
    { id: 4, title: "Interstellar", director: "Christopher Nolan", year: 2014, genre: "Sci-Fi", rating: 8.6 },
    { id: 5, title: "The Dark Knight", director: "Christopher Nolan", year: 2008, genre: "Action", rating: 9.0 },
    { id: 6, title: "Dunkirk", director: "Christopher Nolan", year: 2017, genre: "War", rating: 7.8 },
    { id: 7, title: "Tenet", director: "Christopher Nolan", year: 2020, genre: "Action", rating: 7.3 },
    { id: 8, title: "Memento", director: "Christopher Nolan", year: 2000, genre: "Thriller", rating: 8.4 }
];

// Middleware to parse JSON requests
app.use(express.json());

// Helper function for case-insensitive partial string matching
const partialMatch = (value, search) => {
    return value.toLowerCase().includes(search.toLowerCase());
};

// Enhanced validation with more specific error messages
const validateMovie = (title, director, year) => {
    const currentYear = new Date().getFullYear();
    let errors = [];

    if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.push("Title is required and should be a non-empty string.");
    }

    if (!director || typeof director !== 'string' || director.trim() === '') {
        errors.push("Director is required and should be a non-empty string.");
    }

    if (!year) {
        errors.push("Year is required.");
    } else if (typeof year !== 'number') {
        errors.push("Year must be a number.");
    } else if (year < 1888 || year > currentYear) {
        errors.push(`Year must be between 1888 and ${currentYear}.`);
    }

    return errors;
};

// Enhanced GET /movies with advanced filtering
app.get('/movies', (req, res) => {
    try {
        let filteredMovies = [...movies];
        const { title, director, year, minRating, genre } = req.query;
        const filters = [];

        // Track applied filters for response metadata
        if (title) {
            filteredMovies = filteredMovies.filter(movie => partialMatch(movie.title, title));
            filters.push(`title containing "${title}"`);
        }

        if (director) {
            filteredMovies = filteredMovies.filter(movie => partialMatch(movie.director, director));
            filters.push(`director matching "${director}"`);
        }

        if (year) {
            const yearNum = parseInt(year);
            if (isNaN(yearNum)) {
                return res.status(400).json({ 
                    error: "Invalid year parameter. Year must be a number." 
                });
            }
            filteredMovies = filteredMovies.filter(movie => movie.year === yearNum);
            filters.push(`year ${year}`);
        }

        if (minRating) {
            const ratingNum = parseFloat(minRating);
            if (isNaN(ratingNum)) {
                return res.status(400).json({ 
                    error: "Invalid rating parameter. Rating must be a number." 
                });
            }
            filteredMovies = filteredMovies.filter(movie => movie.rating >= ratingNum);
            filters.push(`minimum rating of ${minRating}`);
        }

        if (genre) {
            filteredMovies = filteredMovies.filter(movie => partialMatch(movie.genre, genre));
            filters.push(`genre matching "${genre}"`);
        }

        // Enhanced response with metadata
        const response = {
            total: filteredMovies.length,
            filters: filters.length > 0 ? filters : ['none'],
            movies: filteredMovies
        };

        if (filteredMovies.length === 0) {
            response.message = "No movies found matching the specified criteria";
        }

        res.json(response);

    } catch (error) {
        res.status(500).json({ 
            error: "An error occurred while processing your request",
            details: error.message 
        });
    }
});

// Get movie by ID
app.get('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = movies.find(m => m.id === movieId);

    if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
});

// Add new movie
app.post('/movies', (req, res) => {
    const { title, director, year, genre, rating } = req.body;

    // Validate required fields
    const errors = validateMovie(title, director, year);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const newMovie = {
        id: movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1,
        title,
        director,
        year,
        genre: genre || 'Unspecified',
        rating: rating || null
    };

    movies.push(newMovie);
    res.status(201).json(newMovie);
});

// Update movie
app.put('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === movieId);

    if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie not found" });
    }

    const { title, director, year, genre, rating } = req.body;

    // Validate required fields
    const errors = validateMovie(title, director, year);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Update movie with new data
    movies[movieIndex] = {
        id: movieId,
        title,
        director,
        year,
        genre: genre || movies[movieIndex].genre,
        rating: rating !== undefined ? rating : movies[movieIndex].rating
    };

    res.json(movies[movieIndex]);
});

// Delete movie
app.delete('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === movieId);

    if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie not found" });
    }

    movies.splice(movieIndex, 1);
    res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
