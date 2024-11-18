const express = require('express');
const app = express();
const PORT = 3000;
const morgan = require('morgan'); 

// Sample movie data
const movies = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010, genre: "Sci-Fi", rating: 8.8 },
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999, genre: "Sci-Fi", rating: 8.7 },
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019, genre: "Drama", rating: 8.6 },
    { id: 4, title: "Interstellar", director: "Christopher Nolan", year: 2014, genre: "Sci-Fi", rating: 8.6 },
    { id: 5, title: "The Dark Knight", director: "Christopher Nolan", year: 2008, genre: "Action", rating: 9.0 }
];

app.use(morgan('dev'));

// Enhanced GET /movies with debugging logs
app.get('/movies', (req, res) => {
    console.log('Received query parameters:', req.query);
    
    let filteredMovies = [...movies];
    const filters = [];

    // Title filter
    if (req.query.title) {
        const searchTitle = req.query.title.toLowerCase();
        console.log('Filtering by title:', searchTitle);
        filteredMovies = filteredMovies.filter(movie => {
            const match = movie.title.toLowerCase().includes(searchTitle);
            console.log(`${movie.title}: ${match ? 'matched' : 'not matched'}`);
            return match;
        });
        filters.push(`title containing "${req.query.title}"`);
    }

    // Director filter
    if (req.query.director) {
        const searchDirector = req.query.director.toLowerCase();
        console.log('Filtering by director:', searchDirector);
        filteredMovies = filteredMovies.filter(movie => {
            const match = movie.director.toLowerCase().includes(searchDirector);
            console.log(`${movie.director}: ${match ? 'matched' : 'not matched'}`);
            return match;
        });
        filters.push(`director matching "${req.query.director}"`);
    }

    // Year filter
    if (req.query.year) {
        const yearNum = parseInt(req.query.year);
        console.log('Filtering by year:', yearNum);
        if (!isNaN(yearNum)) {
            filteredMovies = filteredMovies.filter(movie => {
                const match = movie.year === yearNum;
                console.log(`${movie.year}: ${match ? 'matched' : 'not matched'}`);
                return match;
            });
            filters.push(`year ${yearNum}`);
        }
    }

    // Genre filter
    if (req.query.genre) {
        const searchGenre = req.query.genre.toLowerCase();
        console.log('Filtering by genre:', searchGenre);
        filteredMovies = filteredMovies.filter(movie => {
            const match = movie.genre.toLowerCase().includes(searchGenre);
            console.log(`${movie.genre}: ${match ? 'matched' : 'not matched'}`);
            return match;
        });
        filters.push(`genre matching "${req.query.genre}"`);
    }

    // Rating filter
    if (req.query.minRating) {
        const ratingNum = parseFloat(req.query.minRating);
        console.log('Filtering by minimum rating:', ratingNum);
        if (!isNaN(ratingNum)) {
            filteredMovies = filteredMovies.filter(movie => {
                const match = movie.rating >= ratingNum;
                console.log(`${movie.rating}: ${match ? 'matched' : 'not matched'}`);
                return match;
            });
            filters.push(`minimum rating of ${ratingNum}`);
        }
    }

    console.log('Final filtered movies count:', filteredMovies.length);

    const response = {
        total: filteredMovies.length,
        filters: filters.length > 0 ? filters : ['none'],
        movies: filteredMovies
    };

    res.json(response);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('\nTest these URLs:');
    console.log('1. Single filter:');
    console.log('   http://localhost:3000/movies?director=nolan');
    console.log('   http://localhost:3000/movies?year=2010');
    console.log('\n2. Combined filters:');
    console.log('   http://localhost:3000/movies?director=nolan&year=2010');
    console.log('   http://localhost:3000/movies?genre=sci-fi&minRating=8.7');
});
