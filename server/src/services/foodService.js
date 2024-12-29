import db from '../models/index';
const cloudinary = require('../config/cloudinaryConfig');

class FoodService {
    async createFood(foodData, userId) {
        try {
            // Check if the food already exists for the user
            const existingFood = await db.Food.findOne({
                where: {
                    name: foodData.name,
                    user_id: userId
                }
            });

            if (existingFood) {
                throw new Error('Food item already exists for this user.');
            }

            // Create a new food record in the database
            const newFood = await db.Food.create({
                ...foodData, // spread the food data
                user_id: userId // associate the food with a user
            });

            return newFood; // Return the created food record
        } catch (error) {
            throw new Error(`Error creating food: ${error.message}`);
        }
    }

    async updateFood(foodId, foodData) {
        try {
            const food = await db.Food.findByPk(foodId)

            if (!food) {
                throw new Error('Food not found or you are not authorized to update this food.');
            }

            const updatedFood = await food.update(foodData);

            return updatedFood;
        } catch (error) {
            throw new Error(`Error updating food: ${error.message}`);
        }
    }

    async deleteFood(foodId) {
        try {
            const food = await db.Food.findByPk(foodId);

            if (!food) {
                throw new Error('Food not found or you are not authorized to delete this food.');
            }

            await food.destroy();

            return { message: 'Food deleted successfully.' };
        } catch (error) {
            throw new Error(`Error deleting food: ${error.message}`);
        }
    }

    async getFood(userId, page = 1, limit = 10) {
        try {
            // Calculate the offset for pagination
            const offset = (page - 1) * limit;

            // Fetch the food items with pagination
            const foods = await db.Food.findAndCountAll({
                where: {
                    user_id: userId, // Filter by the provided user_id
                },
                attributes: { exclude: ['user_id'] },
                limit: limit,
                offset: offset,
                order: [['id', 'ASC']],  // Optional: order by food name (can change to other fields)
            });

            // Return paginated food data
            return {
                foods: foods.rows,
                totalItems: foods.count,
                totalPages: Math.ceil(foods.count / limit),
                currentPage: page,
            };
        } catch (error) {
            throw new Error(`Error fetching food: ${error.message}`);
        }
    }


    async uploadImage(foodId, file) {
        try {
            if (!file) {
                throw new Error('No file uploaded.');
            }

            const result = await cloudinary.uploader.upload(file.path, {
                public_id: `food/${foodId}`,
                overwrite: true,
                fetch_format: 'auto', // Tự động định dạng
                quality: 'auto', // Tự động chất lượng
                transformation: [
                    {
                        crop: 'fill', // Cắt hình ảnh để lấp đầy kích thước
                        gravity: 'auto', // Tự động xác định trọng tâm của hình ảnh
                        width: 500, // Chiều rộng mong muốn
                        height: 500 // Chiều cao mong muốn
                    }
                ]
            });

            // Cập nhật URL hình ảnh vào cơ sở dữ liệu
            await db.Food.update(
                { image_url: result.secure_url }, // Cập nhật URL hình ảnh
                { where: { id: foodId } } // Điều kiện cập nhật
            );

            return result.secure_url; // Trả về URL hình ảnh
        } catch (error) {
            // Xử lý lỗi
            console.error('Error uploading image:', error);
            throw new Error('Image upload failed.'); // Ném lỗi mới để thông báo cho caller
        }
    }
}

module.exports = new FoodService();