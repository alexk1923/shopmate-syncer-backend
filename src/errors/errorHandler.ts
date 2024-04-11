import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { BadRequestException, ResourceAlreadyExists } from "./errorTypes.js";
import { StatusCodes, getReasonPhrase } from "http-status-codes";


function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    switch (err.name) {
      case 'ResourceAlreadyExists':
        res.status(StatusCodes.CONFLICT).send({ errMessage: err.message, errType: getReasonPhrase(StatusCodes.CONFLICT) });
        break;
      case 'BadRequestException':
        res.status(StatusCodes.BAD_REQUEST).send({ errMessage: err.message, errType: getReasonPhrase(StatusCodes.BAD_REQUEST) });
        break;
      default:
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err: "An error occurred while processing your request",
            errType: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
         });
    }
  }

export {errorHandler}