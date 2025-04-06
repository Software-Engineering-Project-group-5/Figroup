const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     description: Creates a new expense with specified details including split type and payer
 *     tags: [Expenses]
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
 *               - payer_id
 *               - amount
 *               - description
 *               - split_type
 *               - split_details
 *             properties:
 *               group_id:
 *                 type: string
 *                 description: ID of the group the expense belongs to
 *               payer_id:
 *                 type: string
 *                 description: ID of the user who paid for the expense
 *               amount:
 *                 type: number
 *                 description: Total amount of the expense
 *               description:
 *                 type: string
 *                 description: Description of the expense
 *               split_type:
 *                 type: string
 *                 enum: [EQUAL, CUSTOM]
 *                 description: Type of split for the expense
 *               split_details:
 *                 type: object
 *                 additionalProperties: 
 *                   type: number
 *                 description: Map of user IDs to their share amounts (for CUSTOM split)
 *     responses:
 *       201:
 *         description: Expense created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expense_id:
 *                   type: string
 *                   description: ID of the created expense
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Server error
 */
router.post('/', auth, expenseController.createExpense);

/**
 * @swagger
 * /api/expenses/{expense_id}:
 *   get:
 *     summary: Get expense details
 *     description: Retrieves detailed information about a specific expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expense_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the expense to retrieve
 *     responses:
 *       200:
 *         description: Expense details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Expense ID
 *                 group_id:
 *                   type: string
 *                   description: ID of the group the expense belongs to
 *                 payer_id:
 *                   type: string
 *                   description: ID of the user who paid for the expense
 *                 amount:
 *                   type: number
 *                   description: Total amount of the expense
 *                 description:
 *                   type: string
 *                   description: Description of the expense
 *                 split_type:
 *                   type: string
 *                   enum: [EQUAL, CUSTOM]
 *                   description: Type of split for the expense
 *                 split_details:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   description: Map of user IDs to their share amounts
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the expense was created
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Server error
 */
router.get('/:expense_id', auth, expenseController.getExpense);

/**
 * @swagger
 * /api/groups/{group_id}/expenses:
 *   get:
 *     summary: Get all expenses for a group
 *     description: Retrieves a list of all expenses associated with a specific group
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the group
 *     responses:
 *       200:
 *         description: List of group expenses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Expense ID
 *                   group_id:
 *                     type: string
 *                     description: ID of the group the expense belongs to
 *                   payer_id:
 *                     type: string
 *                     description: ID of the user who paid for the expense
 *                   amount:
 *                     type: number
 *                     description: Total amount of the expense
 *                   description:
 *                     type: string
 *                     description: Description of the expense
 *                   split_type:
 *                     type: string
 *                     enum: [EQUAL, CUSTOM]
 *                     description: Type of split for the expense
 *                   split_details:
 *                     type: object
 *                     additionalProperties:
 *                       type: number
 *                     description: Map of user IDs to their share amounts
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the expense was created
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
router.get('/groups/:group_id/expenses', auth, expenseController.getGroupExpenses);

module.exports = router;