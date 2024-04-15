import jwt, { Secret } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/errorTypes.js';
import { StatusCodes } from 'http-status-codes';


function auth(req: Request, res: Response, next: NextFunction) {

    console.log("here");
    console.log(req.headers);
    
    
    if(req.headers && req.headers.authorization) {
        console.log(req.headers.authorization);
        
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new CustomError("No token provided.", StatusCodes.UNAUTHORIZED);
        }
    
        try {
            jwt.verify(token, process.env.TOKEN_KEY as Secret);
        } catch (err) {
            throw new CustomError("Invalid or expired token.", StatusCodes.UNAUTHORIZED);
        }
    
        return next();
    } else {
        throw new CustomError("No token provided.", StatusCodes.UNAUTHORIZED);
    }

   
}

export {auth}