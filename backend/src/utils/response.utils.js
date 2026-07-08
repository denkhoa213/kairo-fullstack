import { STATUS_CODES } from "../constants/status.constants.js";

export const successResponse = (
  res,
  data = null,
  message = "Thành công!",
  statusCode = STATUS_CODES.OK,
) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const createdResponse = (
  res,
  data = null,
  message = "Đã tạo thành công!",
) => {
  return successResponse(res, data, message, STATUS_CODES.CREATED);
};

export const errorResponse = (
  res,
  message = "Đã có lỗi xảy ra!",
  statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR,
  error = null,
) => {
  const response = {
    success: false,
    message,
  };

  if (error !== null) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

export const badRequestResponse = (
  res,
  message = "Yêu cầu không hợp lệ!",
  errors = null,
) => {
  const response = {
    success: false,
    message,
  };
  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(STATUS_CODES.BAD_REQUEST).json(response);
};

export const unauthorizedResponse = (
  res,
  message = "Unauthorized",
  error = null,
) => {
  return errorResponse(res, message, STATUS_CODES.UNAUTHORIZED, error);
};

export const conflictResponse = (res, message = "Tài nguyên đã tồn tại!") => {
  return res.status(STATUS_CODES.CONFLICT).json({
    success: false,
    message,
  });
};
