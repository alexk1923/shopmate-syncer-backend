import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CustomError } from "./errorTypes.js";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

function errorHandler(
	err: CustomError | Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof CustomError) {
		return res
			.status(err.statusCode)
			.send({
				message: err.message,
				errorType: getReasonPhrase(err.statusCode),
			});
	}

	console.log(err);

	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
		message: "An error occurred while processing your request",
		errorType: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
	});
}

export { errorHandler };
