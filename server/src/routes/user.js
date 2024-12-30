const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Allows a user to register by providing a username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Error registering user
 */
router.post('/register', UserController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Log in a user
 *     description: Allows a user to log in by providing a username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid username or password
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /users/add-info:
 *   post:
 *     tags:
 *       - Users
 *     summary: Add or update user information
 *     description: Allows a user to add or update their personal information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 description: Phone number
 *                 example: "+1234567890"
 *               age:
 *                 type: number
 *                 description: Age of the user
 *                 example: 30
 *               weight:
 *                 type: number
 *                 description: Weight in kg
 *                 example: 75.5
 *               height:
 *                 type: number
 *                 description: Height in cm
 *                 example: 180
 *     responses:
 *       200:
 *         description: User information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User information updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     age:
 *                       type: number
 *                       example: 30
 *                     weight:
 *                       type: number
 *                       example: 75.5
 *                     height:
 *                       type: number
 *                       example: 180
 *       400:
 *         description: Error updating user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 */
router.post('/add-info', UserController.addUserInfo);

/**
 * @swagger
 * /users/nutrition-stats:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get nutrition statistics for the user
 *     description: Retrieve nutrition statistics for the user based on meals and foods within a date range. If no dates are provided, defaults to the last 7 days.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the statistics (YYYY-MM-DD). If not provided, defaults to 7 days ago.
 *       - in: query
 *         name: toDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the statistics (YYYY-MM-DD). If not provided, defaults to today.
 *     responses:
 *       '200':
 *         description: Successful response with nutrition statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCalories:
 *                   type: integer
 *                   description: Total calories consumed
 *                 totalProtein:
 *                   type: integer
 *                   description: Total protein consumed
 *                 totalCarbohydrates:
 *                   type: integer
 *                   description: Total carbohydrates consumed
 *                 totalFats:
 *                   type: integer
 *                   description: Total fats consumed
 *                 totalVitamins:
 *                   type: integer
 *                   description: Total vitamins consumed
 *                 totalMinerals:
 *                   type: integer
 *                   description: Total minerals consumed
 *                 fromDate:
 *                   type: string
 *                   format: date
 *                   description: Start date for the statistics
 *                 toDate:
 *                   type: string
 *                   format: date
 *                   description: End date for the statistics
 *       '400':
 *         description: Invalid date format or other errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get('/nutrition-stats', UserController.getNutritionStats);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user information by userId
 *     description: Retrieve user information for a specific user based on userId
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     age:
 *                       type: integer
 *                     weight:
 *                       type: number
 *                     height:
 *                       type: number
 *       404:
 *         description: User not found
 */
router.get('/:userId', UserController.getUserById);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Log out a user
 *     description: Allows a user to log out by invalidating their session token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Error logging out user
 */
router.post('/logout', UserController.logout);
module.exports = router;
