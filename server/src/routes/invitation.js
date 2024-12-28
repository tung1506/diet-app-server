// src/routes/invitation.js
import express from 'express';
import InvitationController from '../controllers/invitationController';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Invitations
 *   description: Invitation management operations
 */

/**
 * @swagger
 * /invitations:
 *   post:
 *     tags:
 *       - Invitations
 *     summary: Invite a user to a group by username
 *     description: Allows a user to invite another user to a group by providing the username and group ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               groupId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Invitation sent successfully
 *       400:
 *         description: Error sending invitation
 */
router.post('/', InvitationController.inviteUser);

/**
 * @swagger
 * /invitations/pending:
 *   get:
 *     tags:
 *       - Invitations
 *     summary: Get all pending invitations for the current user
 *     description: Allows a user to retrieve all pending invitations they have received.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved pending invitations
 *       400:
 *         description: Error fetching pending invitations
 */
router.get('/pending', InvitationController.getPendingInvitations);

/**
 * @swagger
 * /invitations/accept:
 *   post:
 *     tags:
 *       - Invitations
 *     summary: Accept an invitation to a group
 *     description: Allows a user to accept an invitation by providing the invitation ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invitationId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *       400:
 *         description: Error accepting invitation
 */
router.post('/accept', InvitationController.acceptInvitation);
export default router;