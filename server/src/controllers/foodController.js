const foodService = require('../services/foodService');

const FoodController = {
    async createFood(req, res) {
        try {
            const newFood = await foodService.createFood(req.body, req.userId);
            res.status(201).json(newFood);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async updateFood(req, res) {
        const { foodId } = req.params; // Extract foodId from URL params
        const foodData = req.body; // Extract updated food data from the request body

        try {
            const updatedFood = await foodService.updateFood(foodId, foodData); // Use the service to update food
            res.status(200).json(updatedFood); // Return the updated food record
        } catch (error) {
            res.status(400).json({ error: error.message }); // Return error message if update fails
        }
    },

    async deleteFood(req, res) {
        const { foodId } = req.params; // Extract foodId from URL params

        try {
            const response = await foodService.deleteFood(foodId); // Use the service to delete food
            res.status(200).json(response); // Return success message
        } catch (error) {
            res.status(400).json({ error: error.message }); // Return error message if deletion fails
        }
    },

    async getFood(req, res) {
        try {
            const page = parseInt(req.query.page) || 1; // Default page 1
            const limit = parseInt(req.query.limit) || 10; // Default limit 10

            const result = await foodService.getFood(req.userId, page, limit);

            res.status(200).json({
                foods: result.foods,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
                currentPage: result.currentPage,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async uploadImage(req, res) {
        try {
            const { foodId } = req.body; // Lấy foodId từ body
            const file = req.file; // Lấy file từ request

            // Gọi service để upload hình ảnh
            const imageUrl = await foodService.uploadImage(foodId, file);

            res.status(200).json({
                message: 'Image uploaded successfully',
                imageUrl: imageUrl,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = FoodController;