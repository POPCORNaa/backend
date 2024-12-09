const mongoose = require('mongoose');

// Define the movie schema with validation
const movieSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'], 
        minlength: [1, 'Title must be at least 1 character long'] 
    },
    director: { 
        type: String, 
        required: [true, 'Director is required'], 
        minlength: [1, 'Director must be at least 1 character long'] 
    },
    year: { 
        type: Number, 
        required: [true, 'Year is required'], 
        min: [1900, 'Year must be at least 1900'], 
        max: [2100, 'Year must not exceed 2100'] 
    },
    genre: { 
        type: String, 
        required: [true, 'Genre is required'] 
    },
    rating: { 
        type: Number, 
        required: [true, 'Rating is required'], 
        min: [0, 'Rating must be at least 0'], 
        max: [10, 'Rating must not exceed 10'] 
    },
});

// Create and export the Movie model
const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
