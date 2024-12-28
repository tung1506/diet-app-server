import express from 'express';
import GroupController from '../controllers/groupController';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group management operations
 */

/**
 * @swagger
 * /groups:
 *   get:
 *     tags:
 *       - Groups
 *     summary: Get all groups for the current user
 *     description: Retrieve all groups that the current user is a member of.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved groups
 *       400:
 *         description: Error retrieving groups
 */
router.get('/', GroupController.getUserGroups);

/**
 * @swagger
 * /groups:
 *   post:
 *     tags:
 *       - Groups
 *     summary: Create a new group
 *     description: Allows a user to create a new group with a leader.
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
 *                 example: "Fitness Enthusiasts"
 *               description:
 *                 type: string
 *                 example: "A group for fitness lovers."
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Error creating group
 */
router.post('/', GroupController.createGroup);
export default router;