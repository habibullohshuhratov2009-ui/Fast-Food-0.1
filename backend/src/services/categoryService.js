const queries = require('../db/queries');
const { generateId } = require('../utils/generateId');

const COLLECTION = 'categories';

/**
 * Get all categories
 */
function getAllCategories() {
  return queries.getAll(COLLECTION);
}

/**
 * Get a single category by ID
 */
function getCategoryById(id) {
  const category = queries.getById(COLLECTION, id);
  if (!category) {
    const error = new Error(`Category with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return category;
}

/**
 * Create a new category
 */
function createCategory(data) {
  const { name, icon } = data;

  // Check for duplicates
  const all = queries.getAll(COLLECTION);
  const exists = all.find(
    (c) => c.name.toLowerCase() === name.trim().toLowerCase()
  );
  if (exists) {
    const error = new Error(`Category "${name}" already exists`);
    error.statusCode = 409;
    throw error;
  }

  const newCategory = {
    id: generateId(COLLECTION),
    name: name.trim(),
    icon: icon || '📁',
  };

  return queries.create(COLLECTION, newCategory);
}

/**
 * Update a category
 */
function updateCategory(id, data) {
  getCategoryById(id);

  const updates = {};
  if (data.name) updates.name = data.name.trim();
  if (data.icon) updates.icon = data.icon;

  return queries.update(COLLECTION, id, updates);
}

/**
 * Delete a category
 * Also checks if any products use this category
 */
function deleteCategory(id) {
  getCategoryById(id);

  // Check if any products use this category
  const products = queries.getAll('products');
  const productsInCategory = products.filter((p) => p.categoryId === id);

  if (productsInCategory.length > 0) {
    const error = new Error(
      `Cannot delete category — ${productsInCategory.length} product(s) still use it`
    );
    error.statusCode = 409;
    throw error;
  }

  return queries.remove(COLLECTION, id);
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
