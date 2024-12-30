// src/controllers/searchController.js
import FoodService from '../services/foodService';
import MealService from '../services/mealService';

const SearchController = {
    async search(req, res) {
        try {
            const { query, type } = req.query; // Get the query and type parameters
            const userId = req.userId; // Get the current user's ID from the request
            const page = parseInt(req.query.page) || 1; // Default page 1
            const limit = parseInt(req.query.limit) || 10; // Default limit 10

            if (!query) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Query parameter is required.'
                });
            }

            let results;

            // Check the type and call the appropriate search method
            if (type === 'food') {
                results = await FoodService.searchFood(query, userId, page, limit);
            } else if (type === 'meal') {
                results = await MealService.searchMeals(query, userId, page, limit);
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid type parameter. Use "food" or "meal".'
                });
            }

            return res.status(200).json({
                status: 'success',
                results
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

export default SearchController;