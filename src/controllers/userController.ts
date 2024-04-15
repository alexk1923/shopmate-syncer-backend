import {NextFunction, Request, Response} from 'express'
import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import { Sequelize } from 'sequelize-typescript';
import userService from '../services/userService.js';
import { StatusCodes } from 'http-status-codes';
import { UserCreation } from '../types/index.js';

async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        const {id} = req.params;        
        const foundUser = await userService.getUser(Number(id));
        res.status(StatusCodes.OK).send(foundUser);
    } catch (err) {
        next(err);
    }
}



async function updateUser(req: Request, res: Response, next: NextFunction) {
    const {firstName, lastName, birthday} = req.body;
    const {id} = req.params;

    try{
        const updatedUser = await userService.updateUser({firstName, lastName, birthday}, Number(id));
        console.log(updatedUser);
        res.status(StatusCodes.OK).send(updatedUser);
    } catch(err) {
        next(err);
    }
    
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
    const {id} = req.params;
    console.log("my id is " + id);
    

    try{
        await userService.deleteUser(Number(id));
        res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) { 
        next(err);
    }

}


export {getUser, updateUser, deleteUser}