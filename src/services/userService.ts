import { Sequelize } from "sequelize";
import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import { CustomError } from "../errors/errorTypes.js";
import { StatusCodes } from "http-status-codes";

type UserUpdate = {
    firstName?: string;
    lastName?: string;
    birthday: string;
}

const userService = {
    async createUser(userRegisterData: User) {
        // Find if there is a user with the same username or email
        const {username, email, firstName, lastName, birthday, password} = userRegisterData;
        const existingUser = await User.findOne({where: Sequelize.or({username}, {email})});

        if (existingUser) {
            console.log("Found existing user");
            console.log(existingUser);
            
            if(existingUser.getDataValue('username') === userRegisterData.username) {
                throw new CustomError("There is already an account using the same username", StatusCodes.CONFLICT);
            } else if(existingUser.getDataValue('email') === userRegisterData.email) {
                throw new CustomError("There is already an account using the same email address", StatusCodes.CONFLICT);
            } else {
                throw new CustomError("Duplicate data for unique field", StatusCodes.CONFLICT);
            }
        }

        const saltRounds = 10;
        const encryptedPass = await bcrypt.hash(password, saltRounds);
        console.log("the birthday is");
        console.log(birthday);
        
        // Store user and password in db
        const newUser = new User({email, username, firstName, lastName, birthday, password: encryptedPass});

        console.log("new user is");
        console.log(newUser);

        await newUser.save();

        return newUser;
    },

    async getUser(id: number) {
        const user = await User.findByPk(id);
        console.log("get user");
        console.log(user);
        
        if(!user) {
            throw new CustomError("User not found", StatusCodes.NOT_FOUND);
        }
        return user;
    },

    async updateUser(userUpdate: UserUpdate, id: number) {
        const {firstName, lastName, birthday} = userUpdate;
        const updatedUser = await User.update({firstName, lastName, birthday}, {where: {id}});
        if(!updatedUser) {
            throw new CustomError("User not found", StatusCodes.NOT_FOUND);
        }
        return updatedUser;
    },

    async deleteUser(id: number) {
        console.log("my id is "+ id);
        
        await User.destroy({where: {id}});
        return;
    }
}

export default userService