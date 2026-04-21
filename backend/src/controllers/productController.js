const productService = require('../services/productService');

/**
 * GET /api/products
 */
function getAll(req, res, next) {
  try {
    const filters = {
      categoryId: req.query.categoryId,
      available: req.query.available,
    };
    const products = productService.getAllProducts(filters);
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/products/:id
 */
function getOne(req, res, next) {
  try {
    const product = productService.getProductById(Number(req.params.id));
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/products
 */
function create(req, res, next) {
  try {
    const product = productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/products/:id
 */
function update(req, res, next) {
  try {
    const product = productService.updateProduct(Number(req.params.id), req.body);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/products/:id
 */
function remove(req, res, next) {
  try {
    const product = productService.deleteProduct(Number(req.params.id));
    res.json({ success: true, data: product, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getOne, create, update, remove };
