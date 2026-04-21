const { getNextId } = require('../db/queries');

/**
 * Generate the next sequential ID for a given collection
 * @param {string} collection - Collection name
 * @returns {number} The next available ID
 */
function generateId(collection) {
  return getNextId(collection);
}

module.exports = { generateId };
