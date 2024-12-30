import express from 'express';
import SearchController from '../controllers/searchController'; // Ensure this path is correct
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Search meal, food
 */

/**
 * @swagger
 * /search:
 *   get:
 *     tags:
 *       - Search
 *     summary: Search for food and meal names with pagination
 *     description: Allows a user to search for food and meal names based on a query string with pagination support.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term to look for in food names and meal names.
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [food, meal]
 *         description: The type of search. Use "food" to search for food names or "meal" to search for meal names.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of results per page.
 *     responses:
 *       200:
 *         description: Successfully retrieved search results with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: object
 *                   properties:
 *                     foods:
 *                       type: array
 *                       items:
 *                         type: object
 *                     meals:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Bad request if query or type parameter is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/', SearchController.search);

export default router;