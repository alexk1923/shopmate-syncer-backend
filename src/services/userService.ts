import { Sequelize } from "sequelize";
import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import { ResourceAlreadyExists } from "../errors/errorTypes.js";

const userService = {
    async createUser(userRegisterData: User) {
        // Find if there is a user with the same username or email
        const {username, email, firstName, lastName, birthday, password} = userRegisterData;
        const existingUser = await User.findOne({where: Sequelize.or({username}, {email})});

        if (existingUser) {
            console.log("Found existing user");
            console.log(existingUser);
            
            if(existingUser.getDataValue('username') === userRegisterData.username) {
                throw new ResourceAlreadyExists("There is already an account using the same username");
            } else if(existingUser.getDataValue('email') === userRegisterData.email) {
                throw new ResourceAlreadyExists("There is already an account using the same email address");
            } else {
                throw new ResourceAlreadyExists("Duplicate data for unique field");
            }
        }

        const saltRounds = 10;
        const encryptedPass = await bcrypt.hash(password, saltRounds);
        // store user and password in db
        const newUser = new User({email, username, firstName, lastName, birthday, password: encryptedPass});

        console.log("new user is");
        console.log(newUser);

        await newUser.save();

        return newUser;
    },

    updateUser() {

    },

    deleteUser() {

    }
}

export default userService