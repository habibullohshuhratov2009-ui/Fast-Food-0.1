const queries = require('../db/queries');
const { generateId } = require('../utils/generateId');

const COLLECTION = 'orders';

/**
 * Get all orders, optionally filtered by status
 */
function getAllOrders(filters = {}) {
  let orders = queries.getAll(COLLECTION);

  if (filters.status) {
    orders = orders.filter((o) => o.status === filters.status);
  }

  // Sort by createdAt descending (newest first)
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return orders;
}

/**
 * Get a single order by ID
 */
function getOrderById(id) {
  const order = queries.getById(COLLECTION, id);
  if (!order) {
    const error = new Error(`Order with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return order;
}

/**
 * Create a new order
 * Business rules:
 * - Each item must reference a valid, available product
 * - Total is auto-calculated from product prices × quantities
 * - Initial status is always "pending"
 */
function createOrder(data) {
  const { items } = data;

  if (!items || !Array.isArray(items) || items.length === 0) {
    const error = new Error('Order must contain at least one item');
    error.statusCode = 400;
    throw error;
  }

  let total = 0;
  const validatedItems = [];

  for (const item of items) {
    if (!item.productId || !item.qty || item.qty <= 0) {
      const error = new Error(
        'Each item must have a valid productId and qty > 0'
      );
      error.statusCode = 400;
      throw error;
    }

    // Validate product exists and is available
    const product = queries.getById('products', Number(item.productId));
    if (!product) {
      const error = new Error(`Product with ID ${item.productId} not found`);
      error.statusCode = 400;
      throw error;
    }

    if (!product.available) {
      const error = new Error(`Product "${product.name}" is currently unavailable`);
      error.statusCode = 400;
      throw error;
    }

    const lineTotal = product.price * item.qty;
    total += lineTotal;

    validatedItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: item.qty,
    });
  }

  const now = new Date();
  const newOrder = {
    id: generateId(COLLECTION),
    items: validatedItems,
    total: Math.round(total * 100) / 100,
    status: 'pending',
    createdAt: now.toISOString(),
    readableTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
  };

  const createdOrder = queries.create(COLLECTION, newOrder);
  
  if (global.io) {
    global.io.emit('order_created', createdOrder);
  }

  return createdOrder;
}

/**
 * Update order status (pending → preparing → done)
 */
function updateOrder(id, data) {
  const existingOrder = getOrderById(id);

  const allowedStatuses = ['pending', 'preparing', 'cooking', 'ready', 'done', 'served'];

  if (data.status && !allowedStatuses.includes(data.status)) {
    const error = new Error(
      `Invalid status "${data.status}". Allowed: ${allowedStatuses.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  // Only allow status updates on orders
  const updates = {};
  if (data.status) {
    updates.status = data.status;
    
    // Auto timestamp logic
    if (data.status === 'cooking' && !existingOrder.startedAt) {
      updates.startedAt = new Date().toISOString();
    }
    if ((data.status === 'ready' || data.status === 'done' || data.status === 'served') && !existingOrder.completedAt) {
      updates.completedAt = new Date().toISOString();
    }
  }

  const updated = queries.update(COLLECTION, id, updates);

  if (global.io) {
    global.io.emit('order_updated', updated);
  }

  return updated;
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
};
