import { HTTP_STATUS_CODES } from "../constants";

export class ResponseSender {
  static sendSuccess(
    res,
    message = "Success",
    data = undefined,
    statusCode = HTTP_STATUS_CODES.OK,
  ) {
    const response = {
      status: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static sendError(
    res,
    errorMessage = "Failed",
    statusCode = HTTP_STATUS_CODES.BAD_REQUEST,
  ) {
    const response = {
      status: false,
      error: errorMessage,
    };
    return res.status(statusCode).json(response);
  }
}
