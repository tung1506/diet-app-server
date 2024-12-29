const userService = require('../services/userService');

const UserController = {
    async register(req, res) {
        try {
            const newUser = await userService.register(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const { user, session } = await userService.login(username, password);
            res.status(200).json({ user, session });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async addUserInfo(req, res) {
        try {
            const userId = req.userId; // From authentication middleware
            const userData = req.body;

            // Call service method to add/update user info
            const updatedUser = await userService.addUserInfo(userId, userData);

            res.status(200).json({
                message: 'User information updated successfully',
                user: updatedUser
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    },

    async getNutritionStats(req, res) {
        try {
            const userId = req.userId; // Lấy userId từ middleware
            let { fromDate, toDate } = req.query; // Sử dụng let để có thể gán lại giá trị

            // Nếu không có từ ngày và đến ngày, thiết lập mặc định
            if (!fromDate && !toDate) {
                const today = new Date();
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 7);
                fromDate = sevenDaysAgo.toISOString().split('T')[0]; // YYYY-MM-DD
                toDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
            }

            // Gọi service để lấy thống kê dinh dưỡng
            const stats = await userService.getNutritionStats(userId, fromDate, toDate);

            res.status(200).json(stats);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = UserController;