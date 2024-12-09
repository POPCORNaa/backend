const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const https = require('https'); // HTTPS module
const WebSocket = require('ws'); // WebSocket library
const selfsigned = require('selfsigned'); // For generating self-signed certificates
const connectToDatabase = require('./config/db'); // MongoDB connection
const moviesRouter = require('./routes/movies'); // Movies routes
const authRouter = require('./routes/auth'); // Auth routes
const errorHandler = require('./middlewares/errorHandler'); // Error handler
const { initializeWebSocket } = require('./wsHandler'); // WebSocket handler

// Load environment variables
dotenv.config();

const app = express();
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Middleware
app.use(morgan('dev')); // Log requests
app.use(express.json()); // Parse JSON bodies

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Movie API over HTTPS!');
});

// Register the auth router
console.log('Registering /auth router');
app.use('/auth', authRouter); // Register auth routes
console.log('/auth router registered');

// Register the movies router
console.log('Registering /movies router');
app.use('/movies', moviesRouter); // Register movie routes
console.log('/movies router registered');

// Error-handling middleware
app.use(errorHandler);

// Generate self-signed certificates with 2048-bit key
const attrs = [{ name: 'commonName', value: 'localhost' }];
const options = {
    keySize: 2048, // Use a secure key size
    days: 365, // Certificate validity (1 year)
};
const { private: privateKey, cert: certificate } = selfsigned.generate(attrs, options);

// HTTPS server options
const sslOptions = {
    key: privateKey,
    cert: certificate,
};

// Create HTTPS server
const httpsServer = https.createServer(sslOptions, app);

// Initialize WebSocket server
const wsServer = new WebSocket.Server({ server: httpsServer });
initializeWebSocket(wsServer);

// Start the server
const startServer = async () => {
    try {
        await connectToDatabase();
        console.log('Database connection successful');

        httpsServer.listen(HTTPS_PORT, () => {
            console.log(`HTTPS server running on https://localhost:${HTTPS_PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
