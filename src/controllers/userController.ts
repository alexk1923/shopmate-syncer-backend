import {NextFunction, Request, Response} from 'express'
import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import { Sequelize } from 'sequelize-typescript';
import userService from '../services/userService.js';

async function getUser(req: Request, res: Response) {
    console.log(req.query);
    console.log(req.params);

    
    if(req.params.userId) {
        const user = await User.findByPk(Number(req.params.userId));
        if(user) {
            res.status(200).json(user).send();
        } else {
            res.status(404).json({"err": "User not found"}).send();
        }

    } else {
        res.status(400).json({"err": "bad request"}).send();
    }

}

async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const userRegisterData = new User({
            username: req.body.username,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthday: req.body.birthday,
            password: req.body.password
        }
        );

        const user =  await userService.createUser(userRegisterData);

        res.status(200).send(user);
        
    } catch (err) {
        console.log(err);
        next(err);
        // res.status(400).send(err);
    }
}

async function updateUser(req: Request, res: Response) {
    const {firstName, lastName} = req.body;
    const {id} = req.params;
    const updatedUser = await User.update({firstName, lastName}, {where: {id}});
    console.log(updateUser);
    
}

async function deleteUser(req: Request, res: Response) {
    const {id} = req.params;
    User.destroy({where: {id}});
}


export {register, getUser, updateUser, deleteUser}