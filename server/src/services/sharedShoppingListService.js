// src/services/sharedShoppingListService.js
import db from '../models/index';

class SharedShoppingListService {
    async shareShoppingList(shoppingListId, groupId, userId) {
        try {
            // Check if the shopping list exists
            const shoppingList = await db.ShoppingList.findByPk(shoppingListId);
            if (!shoppingList) {
                throw new Error('Shopping list not found.');
            }

            // Check if the group exists
            const group = await db.Group.findByPk(groupId);
            if (!group) {
                throw new Error('Group not found.');
            }

            // Check if the shopping list has already been shared with the group
            const existingSharedList = await db.SharedShoppingList.findOne({
                where: {
                    shopping_list_id: shoppingListId,
                    group_id: groupId
                }
            });

            if (existingSharedList) {
                throw new Error('This shopping list has already been shared with the group.');
            }

            // Create a new entry in the SharedShoppingList table
            const sharedList = await db.SharedShoppingList.create({
                shopping_list_id: shoppingListId,
                group_id: groupId,
            });

            return sharedList;
        } catch (error) {
            throw new Error(`Failed to share shopping list: ${error.message}`);
        }
    }

    async getSharedShoppingListsByGroupId(groupId) {
        try {
            // Check if the group exists
            const group = await db.Group.findByPk(groupId);
            if (!group) {
                throw new Error('Group not found.');
            }

            // Retrieve all shared shopping lists for the group
            const sharedLists = await db.SharedShoppingList.findAll({
                where: { group_id: groupId },
                include: [
                    {
                        model: db.ShoppingList,
                        as: 'shoppingList',
                        include: [
                            {
                                model: db.Food,
                                as: 'food', // Assuming the association is defined in the ShoppingList model
                                attributes: { exclude: ['createdAt', 'updatedAt'] } // Exclude timestamps if not needed
                            }
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] } // Exclude timestamps if not needed
                    }
                ],
                attributes: { exclude: ['updatedAt', 'shopping_list_id'] }
            });

            return sharedLists;
        } catch (error) {
            throw new Error(`Failed to retrieve shared shopping lists: ${error.message}`);
        }
    }

    async markAsBought(sharedShoppingListId, userId) {
        try {
            // Find the shared shopping list
            const sharedList = await db.SharedShoppingList.findByPk(sharedShoppingListId);
            if (!sharedList) {
                throw new Error('Shared shopping list not found.');
            }

            // Check if the user is part of the group
            const group = await db.Group.findByPk(sharedList.group_id);
            const userInGroup = await group.hasUser(userId); // Assuming a method exists to check user membership

            if (!userInGroup) {
                throw new Error('You do not have permission to mark this shopping list as bought.');
            }

            // Update the shared shopping list
            await sharedList.update({
                is_bought: 1,
                bought_by_user_id: userId
            });

            return {
                status: 'success',
                message: 'Shared shopping list marked as bought successfully.'
            };
        } catch (error) {
            throw new Error(`Failed to mark as bought: ${error.message}`);
        }
    }
}

export default new SharedShoppingListService();