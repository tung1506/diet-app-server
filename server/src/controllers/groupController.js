import GroupService from '../services/groupService';

const GroupController = {
    async getUserGroups(req, res) {
        try {
            const userId = req.userId; // Get userId from the authenticated request
            const groups = await GroupService.getGroupsByUserId(userId);
            res.status(200).json(groups);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async createGroup(req, res) {
        try {
            const groupData = req.body; // Get group data from request body
            const userId = req.userId; // Get the current user's ID from the request

            const newGroup = await GroupService.createGroup(groupData, userId);
            res.status(201).json(newGroup);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default GroupController;