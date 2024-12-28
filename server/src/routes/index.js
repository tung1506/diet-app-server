import express from 'express';
const userRoutes = require('./user.js');
const foodRoutes = require('./food.js');
const shoppingListRoutes = require('./shoppingList.js');
const mealRoutes = require('./meal.js');
import groupRoutes from './group.js';
import invitationRoutes from './invitation.js';
import sharedMealRoutes from './sharedMeal.js';

let router = express.Router();

let initWebRoutes = (app) => {
    app.use("/users", userRoutes);
    app.use("/food", foodRoutes);
    app.use("/shopping-list", shoppingListRoutes);
    app.use("/meals", mealRoutes);
    app.use("/groups", groupRoutes);
    app.use("/invitations", invitationRoutes);
    app.use("/shared-meals", sharedMealRoutes);
}

module.exports = initWebRoutes;