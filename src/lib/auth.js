import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds = 12;

// Hash a password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

// Verify a password against a hash
export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generate a JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Verify a JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};