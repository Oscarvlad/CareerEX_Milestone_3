require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key_here';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '5h'; // Token expires in 5 hours

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { 
      user: {
        id: userId,
        role: role
      } 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRE,
  generateToken,
  verifyToken
};