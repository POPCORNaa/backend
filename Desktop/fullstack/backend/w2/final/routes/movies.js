const express = require('express');
const {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
} = require('../controllers/moviesController'); // Import controller functions
const authenticate = require('../middlewares/authenticate'); // Import authentication middleware

const router = express.Router(); // Create the router instance

console.log('Movies router loaded'); // Debug log for router loading

// Public Routes (accessible by all authenticated users)
router.get('/', authenticate(['admin', 'regular']), getMovies);
router.get('/:id', authenticate(['admin', 'regular']), getMovieById);

// Admin Routes (accessible only by admins)
router.post('/', authenticate(['admin']), createMovie);
router.put('/:id', authenticate(['admin']), updateMovie);
router.delete('/:id', authenticate(['admin']), deleteMovie);

// Define routes for CRUD operations
router.get('/test', (req, res) => {
    console.log('GET /movies/test route hit');
    res.send('Movies router is working!');
});

router.get('/', getMovies); // GET /movies - Fetch all movies
router.get('/:id', getMovieById); // GET /movies/:id - Fetch movie by ID

// Protected routes
router.post('/', authenticate, createMovie); // POST /movies - Add a new movie (requires token)
router.put('/:id', authenticate, updateMovie); // PUT /movies/:id - Update a movie by ID (requires token)
router.delete('/:id', authenticate, deleteMovie); // DELETE /movies/:id - Delete a movie by ID (requires token)

module.exports = router; // Export the router object
