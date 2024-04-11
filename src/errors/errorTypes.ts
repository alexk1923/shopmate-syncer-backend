import { getReasonPhrase } from "http-status-codes";

  class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
      super(message);
      this.name = getReasonPhrase(statusCode);
      this.statusCode = statusCode
    }

  }

  export {CustomError}
  