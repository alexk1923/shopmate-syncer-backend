import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CustomError } from "./errorTypes.js";
import { StatusCodes, getReasonPhrase } from "http-status-codes";


function errorHandler(err: CustomError | Error, req: Request, res: Response, next: NextFunction) {
    if(err instanceof CustomError) {
      return res.status(err.statusCode).send({ errMessage: err.message, errType: getReasonPhrase(StatusCodes.CONFLICT)});
    }

    return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
      { 
        err: "An error occurred while processing your request",
        errType: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
      }
    );

}

export {errorHandler}