'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserGroup extends Model {
        static associate(models) {
            // Associations can be defined here if needed
        }
    }

    UserGroup.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onDelete: 'CASCADE',
            },
            group_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Groups',
                    key: 'id'
                },
                onDelete: 'CASCADE',
            }
        },
        {
            sequelize,
            modelName: 'UserGroup',
            timestamps: false,
        }
    );

    return UserGroup;
};