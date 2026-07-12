/**
 * Base API error class with structured error information.
 */
export class ApiError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', status = 500, details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

export class AuthError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Access denied') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'Too many requests', retryAfter = 60) {
    super(message, 'RATE_LIMIT', 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class ConfigError extends ApiError {
  constructor(message = 'Server configuration error') {
    super(message, 'CONFIG_ERROR', 500);
    this.name = 'ConfigError';
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}

/**
 * Safely handles an API route error, logging appropriately and
 * returning a sanitized response.
 */
export function handleApiError(error, context = {}) {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      console.error(`[API] ${error.status} ${error.code}`, {
        message: error.message,
        path: context.path,
        method: context.method,
      });
    }
    return Response.json(error.toJSON(), {
      status: error.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  console.error(`[API] Unhandled error${context.path ? ` at ${context.path}` : ''}:`, error);

  return Response.json(
    {
      error: isProduction ? 'Internal server error' : error.message || 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
    { status: 500, headers: { 'Content-Type': 'application/json' } },
  );
}
