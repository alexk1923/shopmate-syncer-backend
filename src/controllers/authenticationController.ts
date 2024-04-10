import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Request, Response } from "express";

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!process.env.TOKEN_KEY) {
            throw new Error('TOKEN_KEY is not defined');
          }
    
          
        // if (existingUser && (await bcrypt.compare(password, existingUser.password))) {
        //     const token = jwt.sign({ userID: existingUser._id, email }, process.env.TOKEN_KEY as Secret, {
        //         expiresIn: "1 day"
        //     });

        //     return res.status(200).send({
        //         "id": existingUser._id,
        //         "email": existingUser.email,
        //         "username": existingUser.username,
        //         "token": token,
        //         favoritePlaces: existingUser.favoritePlaces,
        //         profilePhoto: existingUser.profilePhoto
        //     });
        // }

        return res.status(400).json({ err: "Wrong credentials. Please try again" });

    } catch (err) {
        console.log(err);
    }
}

const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        // Find if there is a user with the same username or email

        // if (existingUser) {
        //     return res.status(409).send({ err: "There is already an account using this email address." });
        // }
        const saltRounds = 10;
        const encryptedPass = await bcrypt.hash(password, saltRounds);
        // store user and password in db


        // Create new user and return

        

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}


