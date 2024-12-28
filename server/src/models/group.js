'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Group extends Model {
        static associate(models) {
            // Many-to-Many association with User
            Group.belongsToMany(models.User, {
                through: 'UserGroup', // Junction table for the many-to-many relationship
                foreignKey: 'group_id',
                otherKey: 'user_id',
                as: 'users'
            });
            Group.belongsTo(models.User, {
                foreignKey: 'leader_id', // Reference to the leader
                as: 'leader' // Alias for the association
            });
        }
    }

    Group.init(
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
            created_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            participants: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive', 'archived'),
                defaultValue: 'active',
            },
            leader_id: { // New field for group leader
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Users', // Reference to Users table
                    key: 'id',
                },
                onDelete: 'CASCADE', // If the leader is deleted, the group will also be deleted
            }
        },
        {
            sequelize,
            modelName: 'Group',
            timestamps: false,
        }
    );

    return Group;
};