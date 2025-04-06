const express = require('express');
const router = express.Router();
const settlementController = require('../controllers/settlementController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/settlements:
 *   post:
 *     summary: Create a new settlement
 *     description: Records a new settlement between users to resolve debts or expenses within a group.
 *     tags: [Settlements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group_id
 *               - from_user_id
 *               - to_user_id
 *             properties:
 *               group_id:
 *                 type: string
 *                 description: ID of the group where settlement is occurring
 *                 example: "67d5ad9e3cc22e833a11dd32"
 *               from_user_id:
 *                 type: string
 *                 description: ID of the user who owes money (payer)
 *                 example: "67d5ace83cc22e833a11dd2d"
 *               to_user_id:
 *                 type: string
 *                 description: ID of the user who is owed money (payee)
 *                 example: "67d5a8609335c8e6e12013cc"
 *     responses:
 *       201:
 *         description: Settlement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Settlement_id:
 *                   type: string
 *                   description: Unique identifier for the created settlement
 *                   example: "67f2cb453a8921f09ad3fe12"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Invalid settlement data"
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
router.post('/', auth, settlementController.createSettlement);

/**
 * @swagger
 * /api/settlements/{settlement_id}:
 *   get:
 *     summary: Get settlement details
 *     description: Retrieves information about a specific settlement by its ID.
 *     tags: [Settlements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: settlement_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the settlement
 *         example: "67f2cb453a8921f09ad3fe12"
 *     responses:
 *       200:
 *         description: Settlement details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Settlement ID
 *                   example: "67f2cb453a8921f09ad3fe12"
 *                 group_id:
 *                   type: string
 *                   description: ID of the associated group
 *                   example: "67d5ad9e3cc22e833a11dd32"
 *                 from_user_id:
 *                   type: string
 *                   description: ID of the user who owes money
 *                   example: "67d5ace83cc22e833a11dd2d"
 *                 to_user_id:
 *                   type: string
 *                   description: ID of the user who is owed money
 *                   example: "67d5a8609335c8e6e12013cc"
 *                 status:
 *                   type: string
 *                   description: Current status of the settlement
 *                   enum: [PENDING, COMPLETED]
 *                   example: "PENDING"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Settlement creation timestamp
 *                   example: "2025-04-05T23:45:25.850Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Settlement last update timestamp
 *                   example: "2025-04-05T23:45:25.850Z"
 *       404:
 *         description: Settlement not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Settlement not found"
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
router.get('/:settlement_id', auth, settlementController.getSettlements);

module.exports = router;