const express = require('express');
const shoppingListController = require('../controllers/shoppingListController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shopping List
 *   description: Shopping list management operations
 */

/**
 * @swagger
 * /shopping-list:
 *   post:
 *     tags:
 *       - Shopping List
 *     summary: Create a new shopping list
 *     description: Allows a user to create multiple shopping list entries
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 food_id:
 *                   type: integer
 *                   example: 1
 *                 quantity:
 *                   type: number
 *                   example: 2.5
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2024-01-15"
 *                 is_bought:
 *                   type: boolean
 *                   example: false
 *                 note:
 *                   type: string
 *                   example: "Buy organic if possible"
 *     responses:
 *       201:
 *         description: Shopping list entries created successfully
 *       400:
 *         description: Error creating shopping list
 */
router.post('/', shoppingListController.createShoppingList);

/**
 * @swagger
 * /shopping-list/{id}:
 *   put:
 *     tags:
 *       - Shopping List
 *     summary: Update a shopping list entry
 *     description: Update details of an existing shopping list entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the shopping list entry to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 3
 *               is_bought:
 *                 type: boolean
 *                 example: true
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               note:
 *                 type: string
 *                 example: "Updated shopping list item"
 *     responses:
 *       200:
 *         description: Shopping list entry updated successfully
 *       400:
 *         description: Error updating shopping list
 */
router.put('/:id', shoppingListController.updateShoppingList);

/**
 * @swagger
 * /shopping-list/{id}:
 *   delete:
 *     tags:
 *       - Shopping List
 *     summary: Delete a shopping list entry
 *     description: Remove a specific shopping list entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the shopping list entry to delete
 *     responses:
 *       200:
 *         description: Shopping list entry deleted successfully
 *       400:
 *         description: Error deleting shopping list
 */
router.delete('/:id', shoppingListController.deleteShoppingList);

/**
 * @swagger
 * /shopping-list:
 *   get:
 *     tags:
 *       - Shopping List
 *     summary: Get shopping list for the current user
 *     description: Retrieve paginated shopping list entries for the current user
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Successfully retrieved shopping list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shoppingLists:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       food_id:
 *                         type: integer
 *                       quantity:
 *                         type: number
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       is_bought:
 *                         type: boolean
 *                       note:
 *                         type: string
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       400:
 *         description: Error retrieving shopping list
 */
router.get('/', shoppingListController.getShoppingList);

/**
 * @swagger
 * /shopping-list/by-date:
 *   get:
 *     tags:
 *       - Shopping List
 *     summary: Get shopping list by date range
 *     description: Retrieve shopping list items for the current user within a specific date range
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved shopping list by date
 *       400:
 *         description: Error retrieving shopping list
 */
router.get('/by-date', shoppingListController.getShoppingListByDate);

/**
 * @swagger
 * /shopping-list/share:
 *   post:
 *     tags:
 *       - Shopping List
 *     summary: Share a shopping list with a group
 *     description: Allows a user to share a shopping list with a specified group
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shoppingListId:
 *                 type: integer
 *                 example: 1
 *               groupId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Shopping list shared successfully
 *       400:
 *         description: Error sharing shopping list
 */
router.post('/share', shoppingListController.shareShoppingList);

/**
 * @swagger
 * /shopping-list/group/{groupId}:
 *   get:
 *     tags:
 *       - Shopping List
 *     summary: Get all shared shopping lists in a group
 *     description: Retrieve all shared shopping lists associated with a specified group
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the group to retrieve shared shopping lists for
 *     responses:
 *       200:
 *         description: Successfully retrieved shared shopping lists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 sharedLists:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       food_id:
 *                         type: integer
 *                       quantity:
 *                         type: number
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       is_bought:
 *                         type: boolean
 *                       note:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Error retrieving shared shopping lists
 */
router.get('/group/:groupId', shoppingListController.getSharedShoppingLists);

/**
 * @swagger
 * /shopping-list/group/mark-as-bought:
 *   post:
 *     tags:
 *       - Shopping List
 *     summary: Mark a shared shopping list as bought
 *     description: Allows a user in the group to mark a shared shopping list as bought and updates the bought_by_user_id field.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sharedShoppingListId:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the shared shopping list to be marked as bought.
 *     responses:
 *       200:
 *         description: Successfully marked the shared shopping list as bought
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Shared shopping list marked as bought successfully."
 *       400:
 *         description: Error marking the shared shopping list as bought
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "You do not have permission to mark this shopping list as bought."
 *       404:
 *         description: Shared shopping list not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Shared shopping list not found."
 */
router.post('/group/mark-as-bought', shoppingListController.markAsBought);

/**
 * @swagger
 * /shopping-list/statistics:
 *   get:
 *     tags:
 *       - Shopping List
 *     summary: Get statistics for the user's shopping list
 *     description: Retrieve total bought and unbought quantities for each food item in the user's shopping list.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved shopping list statistics
 *       400:
 *         description: Error retrieving shopping list statistics
 */
router.get('/statistics', shoppingListController.getShoppingListStatistics);
module.exports = router;
