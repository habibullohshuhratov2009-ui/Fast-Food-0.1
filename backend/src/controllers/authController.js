const authService = require('../services/authService');

/**
 * POST /api/login
 */
function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = authService.login(username, password);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

module.exports = { login };
