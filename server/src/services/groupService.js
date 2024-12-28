import db from '../models/index';

class GroupService {
    async getGroupsByUserId(userId) {
        try {
            const groups = await db.Group.findAll({
                include: [{
                    model: db.User,
                    as: 'users',
                    where: { id: userId } // Filter to get only groups that the user belongs to
                }]
            });

            return groups;
        } catch (error) {
            throw new Error(`Error fetching groups: ${error.message}`);
        }
    }

    async createGroup(groupData, userId) {
        try {
            // Check if a group with the same name already exists
            const existingGroup = await db.Group.findOne({
                where: {
                    name: groupData.name
                }
            });

            if (existingGroup) {
                throw new Error('A group with this name already exists.');
            }

            // Set the leader_id to the current user
            groupData.leader_id = userId;

            // Create the new group
            const newGroup = await db.Group.create(groupData);

            // Insert the current user into the UserGroup table
            await db.UserGroup.create({
                user_id: userId,
                group_id: newGroup.id // Use the ID of the newly created group
            });

            return newGroup;
        } catch (error) {
            throw new Error(`Error creating group: ${error.message}`);
        }
    }
}

export default new GroupService();