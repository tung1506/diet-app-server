// src/services/sharedMealService.js
import db from '../models/index';

class SharedMealService {
    async shareMeal(mealId, groupId, userId) {
        try {
            // Check if the meal exists and belongs to the current user
            const meal = await db.Meal.findOne({
                where: {
                    id: mealId,
                    user_id: userId // Ensure the meal belongs to the current user
                }
            });

            if (!meal) {
                throw new Error('Meal not found or does not belong to the current user.');
            }

            // Check if the group exists
            const group = await db.Group.findByPk(groupId);
            if (!group) {
                throw new Error('Group not found.');
            }

            // Check if the meal is already shared with the group
            const existingSharedMeal = await db.SharedMeal.findOne({
                where: {
                    meal_id: mealId,
                    group_id: groupId
                }
            });

            if (existingSharedMeal) {
                throw new Error('This meal has already been shared with the group.');
            }

            // Create a new shared meal record
            const sharedMeal = await db.SharedMeal.create({
                meal_id: mealId,
                group_id: groupId
            });

            return sharedMeal;
        } catch (error) {
            throw new Error(`Error sharing meal: ${error.message}`);
        }
    }

    async getSharedMealsByGroupId(groupId, page = 1, limit = 10) {
        try {
            // Calculate offset for pagination
            const offset = (page - 1) * limit;

            // Fetch shared meals for the specified group with pagination
            const sharedMeals = await db.SharedMeal.findAndCountAll({
                where: {
                    group_id: groupId
                },
                include: [
                    {
                        model: db.Meal,
                        as: 'meal', // Include meal details
                    }
                ],
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']] // Optional: order by creation date
            });

            // Return paginated data
            return {
                sharedMeals: sharedMeals.rows,
                totalItems: sharedMeals.count,
                totalPages: Math.ceil(sharedMeals.count / limit),
                currentPage: page,
            };
        } catch (error) {
            throw new Error(`Error fetching shared meals: ${error.message}`);
        }
    }
}

export default new SharedMealService();