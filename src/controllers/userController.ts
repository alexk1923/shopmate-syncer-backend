import {Request, Response} from 'express'
import User from "../models/userModel.js"

async function getUser(req: Request, res: Response) {
    console.log(req.query);
    console.log(req.params);

    
    if(req.params.userId) {
        const user = User.findByPk(Number(req.query.id));
        if(user) {
            res.status(200).json(user).send();
        } else {
            res.status(404).json({"err": "User not found"}).send();
        }

    } else {
        res.status(400).json({"err": "bad request"}).send();
    }

}

async function createUser(req: Request, res: Response) {

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


export {createUser, getUser, updateUser, deleteUser}