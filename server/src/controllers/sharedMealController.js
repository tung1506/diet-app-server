// src/controllers/sharedMealController.js
import SharedMealService from '../services/sharedMealService';

const SharedMealController = {
    async shareMeal(req, res) {
        try {
            const { mealId, groupId } = req.body; // Get meal ID and group ID from request body
            const userId = req.userId; // Get the current user's ID from the request

            const sharedMeal = await SharedMealService.shareMeal(mealId, groupId, userId);
            res.status(201).json(sharedMeal);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    async getSharedMeals(req, res) {
        try {
            const { groupId } = req.params; // Get group ID from request parameters
            const page = parseInt(req.query.page) || 1; // Default page 1
            const limit = parseInt(req.query.limit) || 10; // Default limit 10

            const sharedMeals = await SharedMealService.getSharedMealsByGroupId(groupId, page, limit);
            res.status(200).json(sharedMeals);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default SharedMealController;