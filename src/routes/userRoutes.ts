import express from "express";
const router = express.Router();
import {
	getUser,
	updateUser,
	deleteUser,
	getUsers,
} from "../controllers/userController.js";
import {
	generateSignature,
	login,
	register,
	verifyToken,
} from "../controllers/authenticationController.js";
import { auth } from "../middleware/auth.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email address
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         birthday:
 *           type: string
 *           format: date
 *           description: The user's birthday in date format (yyyy-mm-dd)
 *         password:
 *           type: string
 *           description: The user's password
 *       required:
 *         - username
 *         - email
 *         - firstName
 *         - lastName
 *         - password
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email address
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         birthday:
 *           type: string
 *           format: date
 *           description: The user's birthday in date format (yyyy-mm-dd)
 *       required:
 *         - username
 *         - email
 *         - firstName
 *         - lastName
 *     UserUpdate:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email address
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         birthday:
 *           type: string
 *           format: date
 *           description: The user's birthday in date format (yyyy-mm-dd)
 *     UserLoginAuth:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for user
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email address
 *         token:
 *           type: string
 *           description: JWT Token user for authentication
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by ID
 *     description: This endpoint retrieves a user by their ID.
 *     operationId: getUser
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 */
router.get("/users/:id", auth, getUser);

router.get("/verify-token", auth, verifyToken);

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Creates a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       200:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/register", register);

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login with an existing account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             oneOf:
 *               - required: [username]
 *                 properties:
 *                   username:
 *                     type: string
 *                     description: The username of the user.
 *               - required: [email]
 *                 properties:
 *                   email:
 *                     type: string
 *                     description: The email address of the user.
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLoginAuth'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

router.post("/login", login);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Updates an existing user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               username:
 *                 type: string
 *                 description: Desired username
 *               firstName:
 *                 type: string
 *                 description: The user's first name
 *               lastName:
 *                 type: string
 *                 description: The user's last name
 *               birthday:
 *                 type: string
 *                 description: The user's birth date
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch("/users/:id", auth, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Deletes a user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of user to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/users/:id", auth, deleteUser);

router.get("/users", auth, getUsers);

router.post("/upload", auth, generateSignature);

export default router;
