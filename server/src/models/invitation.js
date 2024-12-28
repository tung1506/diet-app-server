// src/models/invitation.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Invitation extends Model {
        static associate(models) {
            Invitation.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
            Invitation.belongsTo(models.Group, {
                foreignKey: 'group_id',
                as: 'group'
            });
        }
    }

    Invitation.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Users',
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
            status: {
                type: DataTypes.ENUM('pending', 'accepted', 'declined'),
                defaultValue: 'pending',
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
            modelName: 'Invitation',
            timestamps: true,
        }
    );

    return Invitation;
};