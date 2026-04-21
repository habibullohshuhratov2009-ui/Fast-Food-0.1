const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRequired } = require('../middlewares/validateRequest');

// POST /api/login
router.post(
  '/login',
  validateRequired(['username', 'password']),
  authController.login
);

module.exports = router;
