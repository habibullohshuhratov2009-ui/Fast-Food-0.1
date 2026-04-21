const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateRequired, validateIdParam } = require('../middlewares/validateRequest');

// GET /api/orders
router.get('/', orderController.getAll);

// GET /api/orders/:id
router.get('/:id', validateIdParam, orderController.getOne);

// POST /api/orders
router.post(
  '/',
  validateRequired(['items']),
  orderController.create
);

// PATCH /api/orders/:id
router.patch('/:id', validateIdParam, orderController.update);

module.exports = router;
