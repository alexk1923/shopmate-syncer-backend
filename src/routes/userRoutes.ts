import express from 'express';
const router = express.Router();
import { register, getUser, updateUser, deleteUser } from "../controllers/userController.js";

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Returns the user
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: number
 *              required: true
 *          description: id to find the user
 *     responses:
 *       200:
 *         description: Returns the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  id:
 *                      type: number
 *                      description: auto generated in database
 *                  username:
 *                      type: string
 *                      description: username for user
 *                  firstName:
 *                      type: string
 *                      description: First name for user
 *                  lastName:
 *                      type: string
 *                      description: Last name for user
 *       404:
 *          description: User not found
 *       500:
 *          description: Server error
 */
router.get("/user/:id", getUser);

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Creates a new user
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
 *                 format: date
 *                 description: The user's birth date
 *               password:
 *                 type: string
 *                 description: The user's last name
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/user", register);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
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
 *               birthDay:
 *                 type: string
 *                 description: The user's birth date
 *               password:
 *                 type: string
 *                 description: The user's last name
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/user/:id", updateUser);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Deletes a user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of user to delete
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/user/:id", deleteUser);



export default router;