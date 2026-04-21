/**
 * Validate that required fields exist in req.body
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Function} Express middleware
 */
function validateRequired(requiredFields) {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    next();
  };
}

/**
 * Validate that :id param is a valid number
 */
function validateIdParam(req, res, next) {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID parameter. Must be a positive number.',
    });
  }

  req.params.id = id;
  next();
}

module.exports = { validateRequired, validateIdParam };
