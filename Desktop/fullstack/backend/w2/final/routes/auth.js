const express = require('express');
const { registerUser, login } = require('../controllers/authController');

const router = express.Router();


// Register route
router.post('/register', registerUser);
console.log('Auth routes loaded');

// Login route
router.post('/login', login);
//test
router.get('/test', (req, res) => {
    res.send('Auth test route works!');
});

module.exports = router;
