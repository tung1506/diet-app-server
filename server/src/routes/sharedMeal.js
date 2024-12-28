// src/routes/sharedMeal.js
import express from 'express';
import SharedMealController from '../controllers/sharedMealController';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shared Meals
 *   description: Shared meal management operations
 */

/**
 * @swagger
 * /shared-meals/share:
 *   post:
 *     tags:
 *       - Shared Meals
 *     summary: Share a meal with a group
 *     description: Allows a user to share a meal with a specified group by providing the meal ID and group ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mealId:
 *                 type: integer
 *                 example: 1
 *               groupId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Meal shared successfully
 *       400:
 *         description: Error sharing meal
 */
router.post('/share', SharedMealController.shareMeal);

/**
 * @swagger
 * /shared-meals/group/{groupId}:
 *   get:
 *     tags:
 *       - Shared Meals
 *     summary: Get all shared meals in a group
 *     description: Allows a user to retrieve all shared meals in a specified group with pagination.
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the group to retrieve shared meals for
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved shared meals
 *       400:
 *         description: Error fetching shared meals
 */
router.get('/group/:groupId', SharedMealController.getSharedMeals);

export default router;