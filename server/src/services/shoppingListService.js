import db from '../models/index';
const { Op } = require('sequelize');

class ShoppingListService {
    async createShoppingList(data, userId) {
        try {
            // Validate and check for duplicate entries
            const duplicateEntries = [];

            // Check each item for duplicates
            for (const item of data) {
                const existingEntry = await db.ShoppingList.findOne({
                    where: {
                        user_id: userId,
                        food_id: item.food_id,
                        // Use Sequelize's date function to compare only the date part
                        date: db.sequelize.where(
                            db.sequelize.fn('DATE', db.sequelize.col('date')),
                            '=',
                            db.sequelize.fn('DATE', item.date)
                        )
                    }
                });

                if (existingEntry) {
                    // Find the food name for the duplicate entry
                    const food = await db.Food.findByPk(item.food_id);
                    duplicateEntries.push(food ? food.name : `Food ID ${item.food_id}`);
                }
            }

            // If any duplicates found, throw an error with details
            if (duplicateEntries.length > 0) {
                throw new Error(`Duplicate entries found for: ${duplicateEntries.join(', ')}`);
            }

            // If no duplicates, proceed with bulk creation
            const shoppingList = await db.ShoppingList.bulkCreate(data);
            return shoppingList;
        } catch (error) {
            throw new Error(`Error creating shopping list: ${error.message}`);
        }
    }

    async updateShoppingList(id, updateData) {
        try {
            const shoppingList = await db.ShoppingList.findByPk(id);
            if (!shoppingList) {
                throw new Error('Shopping list not found');
            }

            // Update the shopping list entry
            const updatedShoppingList = await shoppingList.update(updateData);
            return updatedShoppingList;
        } catch (error) {
            throw new Error(`Error updating shopping list: ${error.message}`);
        }
    }

    // Delete a shopping list entry
    async deleteShoppingList(id) {
        try {
            const shoppingList = await db.ShoppingList.findByPk(id);
            if (!shoppingList) {
                throw new Error('Shopping list not found');
            }

            await shoppingList.destroy();
            return { message: 'Shopping list deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting shopping list: ${error.message}`);
        }
    }

    async getShoppingListByUserId(userId, page = 1, limit = 10) {
        try {
            // Calculate offset for pagination
            const offset = (page - 1) * limit;

            // Fetch shopping lists with pagination
            const shoppingLists = await db.ShoppingList.findAndCountAll({
                where: { user_id: userId },
                limit: limit,
                offset: offset,
                order: [['date', 'ASC']],  // Optional: order by date
            });

            // Return the paginated data
            return {
                shoppingLists: shoppingLists.rows,
                totalItems: shoppingLists.count,
                totalPages: Math.ceil(shoppingLists.count / limit),
                currentPage: page,
            };
        } catch (error) {
            throw new Error(`Error fetching shopping list: ${error.message}`);
        }
    }

    async getShoppingListByDate(userId, fromDate, toDate, page = 1, limit = 10) {
        try {
            // Calculate offset for pagination
            const offset = (page - 1) * limit;

            // Use Sequelize's date comparison with only the date part
            const shoppingLists = await db.ShoppingList.findAndCountAll({
                where: {
                    user_id: userId,
                    // Compare only the date part of the datetime
                    date: {
                        [Op.between]: [
                            fromDate,
                            toDate
                        ]
                    }
                },
                limit: limit,
                offset: offset,
                order: [['date', 'ASC']],
                include: [
                    {
                        model: db.Food,
                        as: 'food'
                    }
                ]
            });

            // Return the paginated data
            return {
                shoppingLists: shoppingLists.rows,
                totalItems: shoppingLists.count,
                totalPages: Math.ceil(shoppingLists.count / limit),
                currentPage: page,
            };
        } catch (error) {
            throw new Error(`Error fetching shopping list by date: ${error.message}`);
        }
    }

    // In shoppingListService.js
    async getShoppingListStatistics(userId) {
        // Retrieve all shopping list items for the user
        const shoppingListItems = await db.ShoppingList.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.Food,
                    as: 'food',
                    attributes: ['id', 'name', 'user_id'] // Include food name, ID, and user_id
                }
            ]
        });

        // Initialize statistics object
        const statistics = {};

        // Calculate total bought and unbought quantities
        shoppingListItems.forEach(item => {
            const foodId = item.food_id;
            const foodName = item.food.name;

            // Check if the food belongs to the user
            const foodBelongsToUser = item.food.user_id === userId; // Ensure the food belongs to the user

            if (!foodBelongsToUser) {
                return; // Skip this item if it doesn't belong to the user
            }

            if (!statistics[foodId]) {
                statistics[foodId] = {
                    id: foodId,
                    foodName: foodName,
                    total_bought: 0,
                    total_unbought: 0,
                    total_use_in_meal: 0 // Initialize total use in meals
                };
            }

            if (item.is_bought) {
                statistics[foodId].total_bought += item.quantity;
            } else {
                statistics[foodId].total_unbought += item.quantity;
            }
        });

        // Optimize query to get total use in meals for each food_id
        const mealFoodStats = await db.MealFood.findAll({
            attributes: [
                'food_id',
                [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'total_quantity']
            ],
            where: {
                food_id: Object.keys(statistics) // Only include food_ids that are in the statistics
            },
            group: ['food_id']
        });

        Object.values(statistics).forEach(statistic => {
            // Ensure total_use_in_meal is defined
            const totalUseInMeal = statistic.total_use_in_meal || 0;
            console.log(totalUseInMeal)
            if (statistic.total_bought >= totalUseInMeal) {
                statistic.remaining = statistic.total_bought - totalUseInMeal;
                statistic.need_to_buy = 0; // No need to buy if remaining is positive
            } else {
                statistic.need_to_buy = totalUseInMeal - statistic.total_bought + statistic.total_unbought;
                statistic.remaining = 0; // No remaining if total_bought is less than total_use_in_meal
            }
        });

        return statistics; // Return the statistics object
    }
}

module.exports = new ShoppingListService();