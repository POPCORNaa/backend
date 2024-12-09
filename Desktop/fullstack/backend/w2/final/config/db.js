const mongoose = require('mongoose');

// MongoDB connection
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI); // Mongoose handles the connection options internally now
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Problem with connecting to the database:", error.message);
        process.exit(1); // Exit the backend application process if DB connection fails
    }
};

module.exports = connectToDatabase;
