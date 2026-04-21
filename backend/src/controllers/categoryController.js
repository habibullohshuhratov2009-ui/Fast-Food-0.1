const categoryService = require('../services/categoryService');

/**
 * GET /api/categories
 */
function getAll(req, res, next) {
  try {
    const categories = categoryService.getAllCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/categories/:id
 */
function getOne(req, res, next) {
  try {
    const category = categoryService.getCategoryById(Number(req.params.id));
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/categories
 */
function create(req, res, next) {
  try {
    const category = categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/categories/:id
 */
function update(req, res, next) {
  try {
    const category = categoryService.updateCategory(Number(req.params.id), req.body);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/categories/:id
 */
function remove(req, res, next) {
  try {
    const category = categoryService.deleteCategory(Number(req.params.id));
    res.json({ success: true, data: category, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getOne, create, update, remove };
