const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'db.json');

/**
 * Read the entire database from db.json
 * @returns {Object} Parsed database object
 */
function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading database:', error.message);
    // Return default structure if file is missing/corrupt
    return { products: [], orders: [], categories: [] };
  }
}

/**
 * Write the entire database object to db.json
 * @param {Object} data - The full database object to persist
 */
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database:', error.message);
    throw new Error('Failed to persist data');
  }
}

module.exports = { readDB, writeDB };
