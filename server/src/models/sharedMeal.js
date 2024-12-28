// src/models/sharedMeal.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SharedMeal extends Model {
        static associate(models) {
            SharedMeal.belongsTo(models.Meal, {
                foreignKey: 'meal_id',
                as: 'meal'
            });
            SharedMeal.belongsTo(models.Group, {
                foreignKey: 'group_id',
                as: 'group'
            });
        }
    }

    SharedMeal.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            meal_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Meals',
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
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            sequelize,
            modelName: 'SharedMeal',
            timestamps: true,
        }
    );

    return SharedMeal;
};