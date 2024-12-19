const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    const user = new User({ username, password, role });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).send('Error registering user: ' + err.message);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  } catch (err) {
    res.status(500).send('Error logging in: ' + err.message);
  }
});

module.exports = router;
