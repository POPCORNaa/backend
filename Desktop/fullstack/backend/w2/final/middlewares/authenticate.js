const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (allowedRoles) => (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Decode and verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Log decoded token after verification
        console.log('Decoded token:', decoded);

        req.user = decoded;

        // Check if user's role is allowed
        if (!allowedRoles.includes(decoded.role)) {
            return res.status(403).json({ error: 'Access forbidden: insufficient privileges' });
        }

        next(); // Proceed to the next middleware
    } catch (err) {
        console.error('Token verification failed:', err.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authenticate;
