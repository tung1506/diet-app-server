'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Food extends Model {
        static associate(models) {
            // Define association with User
            Food.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });

            Food.belongsToMany(models.Meal, {
                through: 'MealFood', // Name of the junction table
                foreignKey: 'food_id', // Foreign key in the junction table referencing Food
                otherKey: 'meal_id',   // Foreign key in the junction table referencing Meal
                as: 'meal'            // Alias for the association
            });
        }
    }

    Food.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            calories: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            protein: {
                type: DataTypes.FLOAT,
            },
            carbohydrates: {
                type: DataTypes.FLOAT,
            },
            fats: {
                type: DataTypes.FLOAT,
            },
            vitamins: {
                type: DataTypes.FLOAT,
            },
            minerals: {
                type: DataTypes.FLOAT,
            },
            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            image_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            serving_size: { // New field for serving size
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Food',
            timestamps: false,
        }
    );

    return Food;
};
