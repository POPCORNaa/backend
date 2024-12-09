const Joi = require('joi');
const Movie = require('../models/movies');

// Joi validation schema for movies
const movieValidationSchema = Joi.object({
    title: Joi.string().min(1).required(),
    director: Joi.string().min(1).required(),
    year: Joi.number().integer().min(1900).max(2100).required(),
    genre: Joi.string().min(1).required(),
    rating: Joi.number().min(0).max(10).required(),
});

// Fetch all movies with optional filters
const getMovies = async (req, res, next) => {
    try {
        const query = {};
        if (req.query.title) query.title = { $regex: req.query.title, $options: 'i' };
        if (req.query.director) query.director = { $regex: req.query.director, $options: 'i' };
        if (req.query.year) query.year = parseInt(req.query.year);
        if (req.query.genre) query.genre = { $regex: req.query.genre, $options: 'i' };
        if (req.query.minRating) query.rating = { $gte: parseFloat(req.query.minRating) };

        const movies = await Movie.find(query);
        res.json({ total: movies.length, filters: query, movies });
    } catch (error) {
        next(error);
    }
};

// Fetch a single movie by ID
const getMovieById = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (error) {
        next(error);
    }
};

// Add a new movie
const createMovie = async (req, res, next) => {
    try {
        // Validate input using Joi
        const { error } = movieValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Save to database
        const movie = new Movie(req.body);
        const savedMovie = await movie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        next(err);
    }
};

// Update an existing movie
const updateMovie = async (req, res, next) => {
    try {
        // Validate input using Joi
        const { error } = movieValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Update movie in database
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    } catch (err) {
        next(err);
    }
};

// Delete a movie
const deleteMovie = async (req, res, next) => {
    try {
        const result = await Movie.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Movie not found' });
        res.json({ message: 'Movie deleted' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
};
