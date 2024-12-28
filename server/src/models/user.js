'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Food, {
        foreignKey: 'user_id',
        as: 'foods'
      });

      User.hasMany(models.Meal, {
        foreignKey: 'user_id',
        as: 'meals'
      });

      User.belongsToMany(models.Group, {
        through: 'UserGroup', // Junction table for the many-to-many relationship
        foreignKey: 'user_id', // Foreign key in the junction table referencing User
        otherKey: 'group_id',   // Foreign key in the junction table referencing Group
        as: 'groups'            // Alias for the association
      });
    }
  };

  User.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    session: {
      type: DataTypes.STRING,
    },
    group_ids: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    height: {
      type: DataTypes.FLOAT(53),
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false,
  });

  return User;
};