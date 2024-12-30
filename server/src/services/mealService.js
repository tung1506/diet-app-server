const db = require('../models/index');
const { Op } = require('sequelize');

class MealService {
    async createMeal(mealData, userId) {
        const { name, meal_type, date, foods } = mealData;

        const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        if (!validMealTypes.includes(meal_type)) {
            throw new Error(`Invalid meal type. Must be one of: ${validMealTypes.join(', ')}`);
        }

        // Kiểm tra xem các food có thuộc về user không
        const foodIds = foods.map(food => food.id);
        const userFoods = await db.Food.findAll({
            where: {
                id: foodIds,
                user_id: userId
            }
        });

        if (userFoods.length !== foodIds.length) {
            throw new Error('Some food items do not belong to the user.');
        }

        // Kiểm tra xem có bữa ăn nào đã tồn tại cho ngày và loại bữa ăn không
        if (meal_type !== 'snack') {
            const existingMeal = await db.Meal.findOne({
                where: {
                    user_id: userId,
                    meal_type: meal_type,
                    date: date
                }
            });

            if (existingMeal) {
                throw new Error(`A meal of type ${meal_type} already exists for this date.`);
            }
        }

        // Khởi tạo các biến tổng
        let total_calories = 0;
        let total_protein = 0;
        let total_carbohydrates = 0;
        let total_fats = 0;
        let total_vitamins = 0;
        let total_minerals = 0;

        // Tính toán tổng giá trị dinh dưỡng
        foods.forEach(food => {
            total_calories += food.calories * food.quantity;
            total_protein += food.protein * food.quantity;
            total_carbohydrates += food.carbohydrates * food.quantity;
            total_fats += food.fats * food.quantity;
            total_vitamins += food.vitamins * food.quantity;
            total_minerals += food.minerals * food.quantity
        });

        // Bắt đầu transaction
        const transaction = await db.sequelize.transaction();

        try {
            // Lưu meal vào cơ sở dữ liệu
            const meal = await db.Meal.create({
                name,
                meal_type,
                date,
                total_calories,
                total_protein,
                total_carbohydrates,
                total_fats,
                total_vitamins,
                total_minerals,
                user_id: userId
            }, { transaction });

            // Lưu các food vào bảng MealFoods
            for (const food of foods) {
                await db.MealFood.create({
                    meal_id: meal.id,
                    food_id: food.id,
                    quantity: food.quantity,
                    serving_size: food.serving_size,
                }, { transaction });
            }

            // Commit transaction
            await transaction.commit();

            const createdMeal = await db.Meal.findOne({
                where: { id: meal.id },
                include: [
                    {
                        model: db.Food,
                        as: 'foods',
                        through: {
                            model: db.MealFood,
                            as: 'options',
                            attributes: ['quantity', 'serving_size']
                        }
                    }
                ]
            });

            return createdMeal;
        } catch (error) {
            // Rollback transaction nếu có lỗi
            console.error('Error creating meal:', error);
            await transaction.rollback();
            throw new Error('Error creating meal: ' + error.message);
        }
    }

    async getMealsByUser(userId, mealType, fromDate, toDate, page = 1, limit = 10) {
        try {
            // Validate meal type
            const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
            if (mealType && !validMealTypes.includes(mealType)) {
                throw new Error(`Invalid meal type. Must be one of: ${validMealTypes.join(', ')}`);
            }

            const offset = (page - 1) * limit;

            // Thiết lập điều kiện cho truy vấn
            const whereConditions = {
                user_id: userId,
            };

            if (mealType) {
                whereConditions.meal_type = mealType.toLowerCase(); // Ensure consistent casing
            }

            // Nếu từ ngày và đến ngày không được cung cấp, thiết lập mặc định cho 7 ngày gần nhất
            if (!fromDate && !toDate) {
                const today = new Date();
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 7);
                fromDate = sevenDaysAgo.toISOString().split('T')[0]; // Chuyển đổi sang định dạng YYYY-MM-DD
                toDate = today.toISOString().split('T')[0]; // Chuyển đổi sang định dạng YYYY-MM-DD
            }

            if (fromDate && toDate) {
                whereConditions.date = {
                    [Op.between]: [fromDate, toDate]
                };
            }

            const result = await db.Meal.findAndCountAll({
                where: whereConditions,
                include: [
                    {
                        model: db.Food,
                        as: 'foods',
                        through: {
                            model: db.MealFood,
                            attributes: ['quantity']
                        },
                        attributes: [
                            'id',
                            'name',
                            'calories',
                            'protein',
                            'carbohydrates',
                            'fats',
                            'vitamins',
                            'minerals',
                            'user_id'
                        ]
                    }
                ],
                order: [['date', 'DESC']],
                limit: limit,
                offset: offset,
                distinct: true
            });

            return {
                meals: result.rows,
                totalItems: result.count,
                totalPages: Math.ceil(result.count / limit),
                currentPage: page
            };
        } catch (error) {
            console.error('Detailed Meal Fetch Error:', {
                message: error.message,
                stack: error.stack,
                userId,
                mealType,
                fromDate,
                toDate
            });
            throw new Error(`Error fetching meals: ${error.message}`);
        }
    }

    async updateMealInfo(mealId, userId, updateData) {
        const { name, meal_type, date } = updateData;

        // Kiểm tra xem bữa ăn đã tồn tại với meal_type và date chưa
        const existingMeal = await db.Meal.findOne({
            where: {
                user_id: userId,
                meal_type: meal_type,
                date: date,
                id: mealId
            }
        });

        if (existingMeal) {
            throw new Error(`A meal of type ${meal_type} already exists for this date.`);
        }

        // Cập nhật thông tin bữa ăn
        const meal = await db.Meal.findByPk(mealId);
        if (!meal) {
            throw new Error('Meal not found');
        }

        // Cập nhật các trường của bữa ăn
        meal.name = name;
        meal.date = date;
        meal.meal_type = meal_type;

        // Lưu bữa ăn đã cập nhật
        await meal.save();

        return meal; // Trả về bữa ăn đã được cập nhật
    }

    async updateMealFood(mealId, userId, updateData) {
        const { foods } = updateData;

        // Bắt đầu transaction
        const transaction = await db.sequelize.transaction();
        mealId = Number(mealId);
        try {
            // Xóa tất cả bản ghi có mealId trong bảng MealFood
            await db.MealFood.destroy({
                where: { meal_id: mealId },
                transaction
            });

            // Kiểm tra và thêm các bản ghi mới từ mảng foods vào MealFood
            const mealFoodData = [];
            for (const food of foods) {
                // Kiểm tra xem food có thuộc về user không
                const foodItem = await db.Food.findOne({
                    where: {
                        id: food.food_id,
                        user_id: userId
                    },
                    transaction
                });

                if (!foodItem) {
                    throw new Error(`Food with ID ${food.food_id} does not belong to the user.`);
                }

                mealFoodData.push({
                    meal_id: mealId,
                    food_id: food.food_id,
                    quantity: food.quantity,
                    serving_size: food.serving_size,
                });
            }

            // Thêm các bản ghi mới vào MealFood
            await db.MealFood.bulkCreate(mealFoodData, { transaction });
            console.log('check')
            // Tính toán lại tổng giá trị dinh dưỡng
            let total_calories = 0;
            let total_protein = 0;
            let total_carbohydrates = 0;
            let total_fats = 0;
            let total_vitamins = 0;
            let total_minerals = 0;

            for (const food of foods) {
                const foodItem = await db.Food.findByPk(food.food_id, { transaction });
                if (foodItem) {
                    total_calories += foodItem.calories * food.quantity;
                    total_protein += foodItem.protein * food.quantity;
                    total_carbohydrates += foodItem.carbohydrates * food.quantity;
                    total_fats += foodItem.fats * food.quantity;
                    total_vitamins += foodItem.vitamins * food.quantity;
                    total_minerals += foodItem.minerals * food.quantity;
                }
            }

            // Cập nhật lại các tổng cho bữa ăn
            const meal = await db.Meal.findByPk(mealId);
            if (!meal) {
                throw new Error('Meal not found');
            }

            meal.total_calories = total_calories;
            meal.total_protein = total_protein;
            meal.total_carbohydrates = total_carbohydrates;
            meal.total_fats = total_fats;
            meal.total_vitamins = total_vitamins;
            meal.total_minerals = total_minerals;

            // Lưu lại bữa ăn với các tổng đã cập nhật
            await meal.save({ transaction });

            // Commit transaction
            await transaction.commit();

            return meal; // Trả về bữa ăn đã được cập nhật
        } catch (error) {
            // Rollback transaction nếu có lỗi
            console.error('Error updating meal food:', error);
            await transaction.rollback();
            throw new Error('Error updating meal food: ' + error.message);
        }
    }

    async deleteMeal(mealId, userId) {
        try {
            // Find the meal to ensure it belongs to the user
            const meal = await db.Meal.findOne({
                where: {
                    id: mealId,
                    user_id: userId
                }
            });

            // If meal not found, throw an error
            if (!meal) {
                throw new Error('Meal not found or you are not authorized to delete this meal');
            }

            // Start a transaction
            const transaction = await db.sequelize.transaction();

            try {
                // Delete associated MealFood entries first
                await db.MealFood.destroy({
                    where: { meal_id: mealId },
                    transaction
                });

                // Delete the meal
                await meal.destroy({ transaction });

                // Commit the transaction
                await transaction.commit();

                return {
                    message: 'Meal deleted successfully',
                    mealId: mealId
                };
            } catch (deleteError) {
                // Rollback the transaction if any error occurs
                await transaction.rollback();
                throw deleteError;
            }
        } catch (error) {
            throw new Error(`Error deleting meal: ${error.message}`);
        }
    }

    async searchMeals(query, userId, page = 1, limit = 10) {
        try {
            // Normalize the query by trimming and converting to lowercase
            const normalizedQuery = query.trim().toLowerCase();

            // Calculate the offset for pagination
            const offset = (page - 1) * limit;

            const meals = await db.Meal.findAndCountAll({
                where: {
                    user_id: userId, // Filter by user ID
                    name: {
                        [Op.like]: `%${normalizedQuery}%` // Use LIKE for partial matching
                    }
                },
                limit: limit,
                offset: offset,
                order: [['name', 'ASC']] // Optional: order by meal name
            });

            return {
                meals: meals.rows,
                totalItems: meals.count,
                totalPages: Math.ceil(meals.count / limit),
                currentPage: page,
            };
        } catch (error) {
            throw new Error(`Error searching for meals: ${error.message}`);
        }
    }
}

module.exports = new MealService();