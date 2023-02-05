const { APP_STATE } = require('../helpers/constants');

class ValidationError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || APP_STATE.HTTP_BAD_REQUEST.STATUS;
  }
}

module.exports = ValidationError;
