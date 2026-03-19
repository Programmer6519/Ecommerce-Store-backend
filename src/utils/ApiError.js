class ApiError extends Error {
  constructor(status, message, errors = [], stack) {
    super(message);
    this.status = status;
    this.message = message || this.message;
    ((this.errors = errors), (this.stack = stack && this.stack));
  }
}

export { ApiError };
