const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/users/{user_id}/summary:
 *   get:
 *     summary: Get user financial summary
 *     description: Returns total owed, total to receive, and expense breakdown for a specific user across all groups.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user
 *         example: "67d5a8609335c8e6e12013cc"
 *     responses:
 *       200:
 *         description: User summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_owed:
 *                   type: number
 *                   description: Total amount owed by the user across all groups
 *                   example: 150.25
 *                 total_to_receive:
 *                   type: number
 *                   description: Total amount to be received by the user across all groups
 *                   example: 2006.67
 *                 expense_breakdown:
 *                   type: array
 *                   description: Categorized expense breakdown
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         description: Expense category
 *                         example: "Food"
 *                       amount:
 *                         type: number
 *                         description: Total expense amount in this category
 *                         example: 450.75
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User not found"
 */
router.get('/users/:user_id/summary', auth, reportController.getUserSummary);

/**
 * @swagger
 * /api/groups/{group_id}/report:
 *   get:
 *     summary: Get group financial summary
 *     description: Returns aggregated report data for the group including expenses and investments.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the group
 *         example: "67d5ad9e3cc22e833a11dd32"
 *     responses:
 *       200:
 *         description: Group report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 group_id:
 *                   type: string
 *                   description: Group ID
 *                   example: "67d5ad9e3cc22e833a11dd32"
 *                 total_expenses:
 *                   type: number
 *                   description: Total expenses recorded in the group
 *                   example: 3010.00
 *                 total_investments:
 *                   type: number
 *                   description: Total investments made by the group
 *                   example: 5000.00
 *                 members:
 *                   type: array
 *                   description: List of members in the group
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: string
 *                         description: User ID of the member
 *                         example: "67d5a8609335c8e6e12013cc"
 *                       name:
 *                         type: string
 *                         description: Name of the member
 *                         example: "bhargav"
 *                 expenses:
 *                   type: array
 *                   description: List of expenses in the group
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Expense ID
 *                         example: "67f1cd453a8921f09ad3fe45"
 *                       description:
 *                         type: string
 *                         description: Description of the expense
 *                         example: "Team dinner"
 *                       amount:
 *                         type: number
 *                         description: Expense amount
 *                         example: 1003.33
 *                       payer_id:
 *                         type: string
 *                         description: ID of the user who paid
 *                         example: "67d5a8609335c8e6e12013cc"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: Expense creation timestamp
 *                         example: "2025-04-05T20:15:25.850Z"
 *                 investments:
 *                   type: array
 *                   description: List of investments made by the group
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Investment ID
 *                         example: "67f1cd453a8921f09ad3fe48"
 *                       stock_symbol:
 *                         type: string
 *                         description: Stock symbol
 *                         example: "AAPL"
 *                       company_name:
 *                         type: string
 *                         description: Company name
 *                         example: "Apple Inc."
 *                       amount_invested:
 *                         type: number
 *                         description: Total amount invested
 *                         example: 2000.00
 *                       purchase_date:
 *                         type: string
 *                         format: date-time
 *                         description: Purchase date
 *                         example: "2025-03-20T14:30:25.850Z"
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
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Group not found"
 */
router.get('/groups/:group_id/report', auth, reportController.getGroupReport);

/**
 * @swagger
 * /api/investments/{investment_id}/performance:
 *   get:
 *     summary: Get investment performance
 *     description: Returns current value and profit/loss for a specific investment.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: investment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the investment
 *         example: "67f1cd453a8921f09ad3fe48"
 *     responses:
 *       200:
 *         description: Investment performance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 current_value:
 *                   type: number
 *                   description: Current value of the investment
 *                   example: 2100.50
 *                 profit_loss:
 *                   type: number
 *                   description: Profit or loss amount (positive for profit, negative for loss)
 *                   example: 100.50
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
 *       404:
 *         description: Investment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Investment not found"
 */
router.get('/investments/:investment_id/performance', auth, reportController.getInvestmentPerformance);

module.exports = router;