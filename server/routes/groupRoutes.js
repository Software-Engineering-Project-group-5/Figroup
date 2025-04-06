const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     description: Creates a new investment or expense group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - admin_id
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the group
 *               type:
 *                 type: string
 *                 enum: [EXPENSE, INVESTMENT]
 *                 description: Type of the group
 *               admin_id:
 *                 type: string
 *                 description: ID of the user who will be the admin
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 group_id:
 *                   type: string
 *                   description: ID of the newly created group
 *                   example: "67d5ad9e3cc22e833a11dd32"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Invalid input data"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Toke is not valid"
 */
router.post('/', auth, groupController.createGroup);

/**
 * @swagger
 * /api/groups/{group_id}:
 *   get:
 *     summary: Get group details
 *     description: Retrieves detailed information about a specific group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *     responses:
 *       200:
 *         description: Group details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "67d5ad9e3cc22e833a11dd32"
 *                 name:
 *                   type: string
 *                   example: "Investment Group"
 *                 type:
 *                   type: string
 *                   enum: [EXPENSE, INVESTMENT]
 *                   example: "INVESTMENT"
 *                 admin_id:
 *                   type: string
 *                   example: "67d5a9876cc22e833a11dd12"
 *                 members:
 *                   type: array
 *                   items:
 *                     type: string
 *                 expenses:
 *                   type: array
 *                   items:
 *                     type: string
 *                 investments:
 *                   type: array
 *                   items:
 *                     type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Group or user not found"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Token is not valid"
 */
router.get('/:group_id', auth, groupController.getGroup);

/**
 * @swagger
 * /api/groups/{group_id}/members:
 *   post:
 *     summary: Add a user to a group by email
 *     description: Adds a user to an existing group using their email address
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the user to add
 *                 example: "newUser3.s@northeastern.edu"
 *     responses:
 *       200:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Invalid input data"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Group or user not found"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Toke is not valid"
 */
router.post('/:group_id/members', auth, groupController.addMemberByEmail);

/**
 * @swagger
 * /api/groups/{group_id}/members/{user_id}:
 *   delete:
 *     summary: Remove a user from a group
 *     description: Removes a specific user from an existing group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the group
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to remove
 *     responses:
 *       200:
 *         description: Member removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Cannot remove admin or user not authorized"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Group or user not found"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Token is not valid"
 */
router.delete('/:group_id/members/:user_id', auth, groupController.removeMember);

module.exports = router;