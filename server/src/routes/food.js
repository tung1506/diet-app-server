// food.js

const express = require('express');
const FoodController = require('../controllers/foodController');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: Food
 *   description: Food management
 */

/**
 * @swagger
 * /food/create:
 *   post:
 *     tags:
 *       - Food
 *     summary: Create a new food item
 *     description: Allows a user to create a new food item by providing the food details.
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
 *                 example: Apple
 *               calories:
 *                 type: number
 *                 example: 95
 *               protein:
 *                 type: number
 *                 example: 0.3
 *               carbohydrates:
 *                 type: number
 *                 example: 25
 *               fats:
 *                 type: number
 *                 example: 0.5
 *               vitamins:
 *                 type: number
 *                 example: 10
 *               minerals:
 *                 type: number
 *                 example: 5
 *               serving_size:
 *                 type: string
 *                 example: 1 cup
 *     responses:
 *       201:
 *         description: Food item created successfully
 *       400:
 *         description: Error creating food item
 */
router.post('/create', FoodController.createFood);

/**
 * @swagger
 * /food/delete/{foodId}:
 *   delete:
 *     tags:
 *       - Food
 *     summary: Delete a food item
 *     description: Allows a user to delete a food item by providing the food ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foodId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the food item to delete
 *     responses:
 *       200:
 *         description: Food item deleted successfully
 *       400:
 *         description: Error deleting food item
 */
router.delete('/delete/:foodId', FoodController.deleteFood);

/**
 * @swagger
 * /food/update/{foodId}:
 *   post:
 *     tags:
 *       - Food
 *     summary: Update a food item
 *     description: Allows a user to update a food item by providing the food ID and updated details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foodId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the food item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Apple
 *               calories:
 *                 type: number
 *                 example: 95
 *               protein:
 *                 type: number
 *                 example: 0.3
 *               carbohydrates:
 *                 type: number
 *                 example: 25
 *               fats:
 *                 type: number
 *                 example: 0.5
 *               vitamins:
 *                 type: number
 *                 example: 10
 *               minerals:
 *                 type: number
 *                 example: 5
 *               serving_size:
 *                 type: string
 *                 example: 1 cup
 *     responses:
 *       200:
 *         description: Food item updated successfully
 *       400:
 *         description: Error updating food item
 */
router.post('/update/:foodId', FoodController.updateFood);

/**
 * @swagger
 * /food/:
 *   get:
 *     tags:
 *       - Food
 *     summary: Get all food items
 *     description: Allows a user to retrieve all food items.
 *     BearerAuth:
 *         type: http
 *         scheme: bearer
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Food items retrieved successfully
 *       400:
 *         description: Error retrieving food items
 */
router.get('/', FoodController.getFood);

/**
 * @swagger
 * /food/upload-image:
 *   post:
 *     tags:
 *       - Food
 *     summary: Upload image for Meal
 *     description: Upload an image for a specific food item and overwrite the existing image.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foodId:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Error uploading image
 */
router.post('/upload-image', upload.single('image'), FoodController.uploadImage);

module.exports = router;