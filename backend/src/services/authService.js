const queries = require('../db/queries');

const COLLECTION = 'users';

/**
 * Authenticate a user by username and password
 * @param {string} username
 * @param {string} password
 * @returns {Object} User object (without password) or throws error
 */
function login(username, password) {
  if (!username || !password) {
    const error = new Error('Username and password are required');
    error.statusCode = 400;
    throw error;
  }

  const users = queries.getAll(COLLECTION);
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    const error = new Error('Invalid username or password');
    error.statusCode = 401;
    throw error;
  }

  // Return user data without password
  const { password: _, ...safeUser } = user;
  return safeUser;
}

module.exports = { login };
