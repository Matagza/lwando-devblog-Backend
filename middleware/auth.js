const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Auth Middleware: JWT_SECRET available:', !!process.env.JWT_SECRET, 'length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
  }

  if (!token) {
    console.log('Auth Middleware: No token found');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
