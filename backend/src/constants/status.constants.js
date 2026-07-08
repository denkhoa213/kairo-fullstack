// HTTP Status Codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Success Status
export const SUCCESS_STATUS = {
  OK: "success",
  CREATED: "created",
  ACCEPTED: "accepted",
};

// Error Status
export const ERROR_STATUS = {
  BAD_REQUEST: "bad_request",
  UNAUTHORIZED: "unauthorized",
  FORBIDDEN: "forbidden",
  NOT_FOUND: "not_found",
  CONFLICT: "conflict",
  INTERNAL_SERVER_ERROR: "internal_server_error",
  VALIDATION_ERROR: "validation_error",
};
