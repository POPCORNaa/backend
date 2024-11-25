const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const morgan = require('morgan');
const app = express();
const PORT = 3000;

const uri = "mongodb+srv://leslieyuzhou:admin@cluster0.herty.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let moviesCollection;
client.connect()
    .then(() => {
        console.log("Connected to MongoDB Atlas");
        const db = client.db("moviesDB");
        moviesCollection = db.collection("movies");
    })
    .catch(error => console.error("Failed to connect to MongoDB:", error));

app.use(morgan('dev'));
app.use(express.json());

// GET /movies - Fetch all movies with optional filters
app.get('/movies', async (req, res) => {
    if (!moviesCollection) {
        return res.status(500).json({ error: 'Database not connected' });
    }

    const query = {};
    if (req.query.title) query.title = { $regex: req.query.title, $options: 'i' };
    if (req.query.director) query.director = { $regex: req.query.director, $options: 'i' };
    if (req.query.year) query.year = parseInt(req.query.year);
    if (req.query.genre) query.genre = { $regex: req.query.genre, $options: 'i' };
    if (req.query.minRating) query.rating = { $gte: parseFloat(req.query.minRating) };

    try {
        const filteredMovies = await moviesCollection.find(query).toArray();
        res.json({ total: filteredMovies.length, filters: query, movies: filteredMovies });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// CRUD routes
app.get('/movies/:id', async (req, res) => {
    if (!moviesCollection) return res.status(500).json({ error: 'Database not connected' });

    try {
        const movie = await moviesCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie' });
    }
});

app.post('/movies', async (req, res) => {
    if (!moviesCollection) return res.status(500).json({ error: 'Database not connected' });

    try {
        const result = await moviesCollection.insertOne(req.body);
        res.status(201).json({ message: 'Movie added', movieId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add movie' });
    }
});

app.put('/movies/:id', async (req, res) => {
    if (!moviesCollection) return res.status(500).json({ error: 'Database not connected' });

    try {
        const result = await moviesCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Movie not found' });
        res.json({ message: 'Movie updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update movie' });
    }
});

app.delete('/movies/:id', async (req, res) => {
    if (!moviesCollection) return res.status(500).json({ error: 'Database not connected' });

    try {
        const result = await moviesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Movie not found' });
        res.json({ message: 'Movie deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete movie' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
