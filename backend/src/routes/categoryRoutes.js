const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateRequired, validateIdParam } = require('../middlewares/validateRequest');

// GET /api/categories
router.get('/', categoryController.getAll);

// GET /api/categories/:id
router.get('/:id', validateIdParam, categoryController.getOne);

// POST /api/categories
router.post(
  '/',
  validateRequired(['name']),
  categoryController.create
);

// PATCH /api/categories/:id
router.patch('/:id', validateIdParam, categoryController.update);

// DELETE /api/categories/:id
router.delete('/:id', validateIdParam, categoryController.remove);

module.exports = router;
