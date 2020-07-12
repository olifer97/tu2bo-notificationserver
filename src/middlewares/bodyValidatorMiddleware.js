const { body, validationResult } = require('express-validator');

module.exports = function bodyValidatorMiddleware() {
  const nottificationValidations = [
    body(['notification', 'username'], 'Missing value').exists(),
    body(['visibility'], 'Invalid visibility').isIn(['public', 'private']),
  ];

  const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return res.status(400).json({ reason: firstError.msg });
    }

    next();
  };

  return {
    nottificationValidations,
    validate,
  };
};
