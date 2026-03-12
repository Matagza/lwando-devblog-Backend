const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const protect = async (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('Auth Middleware ERROR: JWT_SECRET is not defined in environment variables.');
    return res.status(500).json({ message: 'Server configuration error: JWT secret missing.' });
  }
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  token = req.headers.authorization.split(' ')[1];
    const secretHash = jwtSecret ? crypto.createHash("sha256").update(jwtSecret).digest("hex") : "N/A";
    console.log('Auth Middleware: JWT_SECRET used for verification (hash):', secretHash, '(length):', jwtSecret ? jwtSecret.length : 0);
  }

  if (!token) {
    console.log('Auth Middleware: No token found');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Auth Middleware: Token decoded, id:', decoded.id);

    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      console.log('Auth Middleware: User not found in DB for id:', decoded.id);
      return res.status(401).json({ message: 'User no longer exists' });
    }

    console.log('Auth Middleware: Success, user:', req.user.name);
    next();
  } catch (error) {
    console.error('Auth Middleware ERROR:', error.message, 'Token:', token ? token.substring(0, 10) + '...' : 'N/A');
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protect };
