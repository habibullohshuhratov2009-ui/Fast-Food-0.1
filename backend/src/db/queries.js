const { readDB, writeDB } = require('./db');

/**
 * Get all items from a collection
 * @param {string} collection - Collection name (products, orders, categories)
 * @returns {Array} All items in the collection
 */
function getAll(collection) {
  const db = readDB();
  return db[collection] || [];
}

/**
 * Get a single item by ID from a collection
 * @param {string} collection - Collection name
 * @param {number} id - Item ID
 * @returns {Object|null} The found item or null
 */
function getById(collection, id) {
  const db = readDB();
  const items = db[collection] || [];
  return items.find((item) => item.id === id) || null;
}

/**
 * Create a new item in a collection
 * @param {string} collection - Collection name
 * @param {Object} item - The item to create (must include id)
 * @returns {Object} The created item
 */
function create(collection, item) {
  const db = readDB();
  if (!db[collection]) {
    db[collection] = [];
  }
  db[collection].push(item);
  writeDB(db);
  return item;
}

/**
 * Update an existing item by ID (partial update / merge)
 * @param {string} collection - Collection name
 * @param {number} id - Item ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} The updated item or null if not found
 */
function update(collection, id, updates) {
  const db = readDB();
  const items = db[collection] || [];
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) return null;

  // Merge updates, prevent id from being changed
  db[collection][index] = { ...items[index], ...updates, id };
  writeDB(db);
  return db[collection][index];
}

/**
 * Remove an item by ID from a collection
 * @param {string} collection - Collection name
 * @param {number} id - Item ID
 * @returns {Object|null} The removed item or null if not found
 */
function remove(collection, id) {
  const db = readDB();
  const items = db[collection] || [];
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) return null;

  const [removed] = db[collection].splice(index, 1);
  writeDB(db);
  return removed;
}

/**
 * Get the next available ID for a collection
 * @param {string} collection - Collection name
 * @returns {number} Next ID
 */
function getNextId(collection) {
  const items = getAll(collection);
  if (items.length === 0) return 1;
  const maxId = Math.max(...items.map((item) => item.id));
  return maxId + 1;
}

module.exports = { getAll, getById, create, update, remove, getNextId };
