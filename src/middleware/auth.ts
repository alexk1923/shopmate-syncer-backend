import jwt, { Secret } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';


function auth(req: Request, res: Response, next: NextFunction) {


    if(req.headers.authorization) {
        const token = req.headers["authorization"].split(" ")[1];
        if (!token) {
            return res.status(403).json({ err: "Token required" });
        }
    
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY as Secret);
        } catch (err) {
            return res.status(401).send({ err: "Invalid token" });
        }
    
        return next();
    }

   
}

export {auth}