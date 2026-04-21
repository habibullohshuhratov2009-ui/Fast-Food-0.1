const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateRequired, validateIdParam } = require('../middlewares/validateRequest');

// GET /api/products
router.get('/', productController.getAll);

// GET /api/products/:id
router.get('/:id', validateIdParam, productController.getOne);

// POST /api/products
router.post(
  '/',
  validateRequired(['name', 'price', 'categoryId']),
  productController.create
);

// PATCH /api/products/:id
router.patch('/:id', validateIdParam, productController.update);

// DELETE /api/products/:id
router.delete('/:id', validateIdParam, productController.remove);

module.exports = router;
