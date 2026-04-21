const queries = require('../db/queries');
const { generateId } = require('../utils/generateId');

const COLLECTION = 'products';

/**
 * Get all products, optionally filtered by categoryId or availability
 */
function getAllProducts(filters = {}) {
  let products = queries.getAll(COLLECTION);

  if (filters.categoryId) {
    products = products.filter(
      (p) => p.categoryId === Number(filters.categoryId)
    );
  }

  if (filters.available !== undefined) {
    products = products.filter(
      (p) => p.available === (filters.available === 'true')
    );
  }

  return products;
}

/**
 * Get a single product by ID
 */
function getProductById(id) {
  const product = queries.getById(COLLECTION, id);
  if (!product) {
    const error = new Error(`Product with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return product;
}

/**
 * Create a new product
 */
function createProduct(data) {
  const { name, price, categoryId, image, description, available } = data;

  // Validate price
  if (typeof price !== 'number' || price <= 0) {
    const error = new Error('Price must be a positive number');
    error.statusCode = 400;
    throw error;
  }

  // Validate category exists
  const category = queries.getById('categories', Number(categoryId));
  if (!category) {
    const error = new Error(`Category with ID ${categoryId} not found`);
    error.statusCode = 400;
    throw error;
  }

  const newProduct = {
    id: generateId(COLLECTION),
    name: name.trim(),
    price: Number(price),
    categoryId: Number(categoryId),
    image: image || '🍽️',
    description: description || '',
    available: available !== undefined ? available : true,
    createdAt: new Date().toISOString(),
  };

  return queries.create(COLLECTION, newProduct);
}

/**
 * Update an existing product (partial update)
 */
function updateProduct(id, data) {
  // Ensure product exists
  getProductById(id);

  // If price is being updated, validate it
  if (data.price !== undefined) {
    if (typeof data.price !== 'number' || data.price <= 0) {
      const error = new Error('Price must be a positive number');
      error.statusCode = 400;
      throw error;
    }
  }

  // If categoryId is being updated, validate it
  if (data.categoryId !== undefined) {
    const category = queries.getById('categories', Number(data.categoryId));
    if (!category) {
      const error = new Error(`Category with ID ${data.categoryId} not found`);
      error.statusCode = 400;
      throw error;
    }
  }

  const updated = queries.update(COLLECTION, id, data);
  return updated;
}

/**
 * Delete a product by ID
 */
function deleteProduct(id) {
  // Ensure product exists
  getProductById(id);
  return queries.remove(COLLECTION, id);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
