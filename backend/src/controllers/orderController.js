const orderService = require('../services/orderService');

/**
 * GET /api/orders
 */
function getAll(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
    };
    const orders = orderService.getAllOrders(filters);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/orders/:id
 */
function getOne(req, res, next) {
  try {
    const order = orderService.getOrderById(Number(req.params.id));
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/orders
 */
function create(req, res, next) {
  try {
    const order = orderService.createOrder(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/orders/:id
 */
function update(req, res, next) {
  try {
    const order = orderService.updateOrder(Number(req.params.id), req.body);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getOne, create, update };
