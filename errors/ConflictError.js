const { APP_STATE } = require('../helpers/constants');

class ConflictError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode =
      statusCode || APP_STATE.REQUEST_CONFLICT_USER_EXISTS.STATUS;
  }
}

module.exports = ConflictError;
