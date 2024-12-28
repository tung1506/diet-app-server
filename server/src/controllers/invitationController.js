// src/controllers/invitationController.js
import InvitationService from '../services/invitationService';

const InvitationController = {
    async inviteUser(req, res) {
        try {
            const { username, groupId } = req.body; // Get username and groupId from request body

            const invitation = await InvitationService.sendInvitation(username, groupId);
            res.status(201).json(invitation);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getPendingInvitations(req, res) {
        try {
            const userId = req.userId; // Get the current user's ID from the request
            const invitations = await InvitationService.getPendingInvitations(userId);
            res.status(200).json(invitations);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async acceptInvitation(req, res) {
        try {
            const { invitationId } = req.body;
            const userId = req.userId;

            const invitation = await InvitationService.acceptInvitation(invitationId, userId);
            res.status(200).json(invitation);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default InvitationController;