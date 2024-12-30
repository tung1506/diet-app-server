// src/models/sharedShoppingList.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SharedShoppingList extends Model {
        static associate(models) {
            SharedShoppingList.belongsTo(models.ShoppingList, {
                foreignKey: 'shopping_list_id',
                as: 'shoppingList'
            });
            SharedShoppingList.belongsTo(models.Group, {
                foreignKey: 'group_id',
                as: 'group'
            });
        }
    }

    SharedShoppingList.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            shopping_list_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'ShoppingLists',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            group_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Groups',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            is_bought: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            bought_by_user_id: { // New field for the user who bought the shopping list
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'SET NULL', // If the user is deleted, set this field to null
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'SharedShoppingList',
            timestamps: true,
        }
    );

    return SharedShoppingList;
};