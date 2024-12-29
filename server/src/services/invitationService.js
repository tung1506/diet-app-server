// src/services/invitationService.js
import db from '../models/index';

class InvitationService {
    async sendInvitation(username, groupId) {
        try {
            // Find the user by username
            const user = await db.User.findOne({
                where: { username }
            });

            if (!user) {
                throw new Error('User  not found.');
            }

            // Check if the group exists
            const group = await db.Group.findByPk(groupId);
            if (!group) {
                throw new Error('Group not found.');
            }

            // Check if the user is already a member of the group
            const isUserInGroup = await db.UserGroup.findOne({
                where: {
                    user_id: user.id,
                    group_id: groupId
                }
            });

            if (isUserInGroup) {
                throw new Error('User  is already a member of this group.');
            }

            // Check if the invitation already exists
            const existingInvitation = await db.Invitation.findOne({
                where: {
                    user_id: user.id,
                    group_id: groupId,
                    status: 'pending'
                }
            });

            if (existingInvitation) {
                throw new Error('An invitation has already been sent to this user for this group.');
            }

            // Create a new invitation
            const invitation = await db.Invitation.create({
                user_id: user.id,
                group_id: groupId,
                status: 'pending'
            });

            return invitation;
        } catch (error) {
            throw new Error(`Error sending invitation: ${error.message}`);
        }
    }

    async getPendingInvitations(userId) {
        try {
            const invitations = await db.Invitation.findAll({
                where: {
                    user_id: userId,
                    status: 'pending'
                },
                include: [
                    {
                        model: db.Group,
                        as: 'group',
                        attributes: ['id', 'name', 'description']
                    }
                ]
            });

            return invitations;
        } catch (error) {
            throw new Error(`Error fetching pending invitations: ${error.message}`);
        }
    }

    async acceptInvitation(invitationId, userId) {
        try {
            // Find the invitation by ID
            const invitation = await db.Invitation.findOne({
                where: {
                    id: invitationId,
                    user_id: userId, // Ensure the invitation belongs to the current user
                    status: 'pending' // Only accept pending invitations
                }
            });

            if (!invitation) {
                throw new Error('Invitation not found or already accepted.');
            }

            // Update the invitation status to accepted
            invitation.status = 'accepted';
            await invitation.save();

            // Add the user to the group
            await db.UserGroup.create({
                user_id: userId,
                group_id: invitation.group_id // Use the group ID from the invitation
            });

            await db.Group.increment('participants', {
                by: 1, // Tăng số lượng người tham gia lên 1
                where: { id: invitation.group_id } // Cập nhật cho nhóm tương ứng
            });

            return invitation; // Return the updated invitation
        } catch (error) {
            throw new Error(`Error accepting invitation: ${error.message}`);
        }
    }
}

export default new InvitationService();