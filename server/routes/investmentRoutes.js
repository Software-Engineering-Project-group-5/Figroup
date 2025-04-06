const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/investments:
 *   post:
 *     summary: Create a new investment
 *     description: Creates a new investment record for a group
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Investment'
 *     responses:
 *       201:
 *         description: Investment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 investment_id:
 *                   type: string
 *                   description: ID of the created investment
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Server error"
 */
router.post('/', auth, investmentController.createInvestment);

/**
 * @swagger
 * /api/investments/{investment_id}:
 *   get:
 *     summary: Get investment details
 *     description: Retrieves detailed information about a specific investment
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: investment_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the investment
 *     responses:
 *       200:
 *         description: Investment details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 investment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67f00cda33d728c96e3b9e9c"
 *                     group_id:
 *                       type: string
 *                       example: "67d5ad9e3cc22e833a11dd32"
 *                     stock_symbol:
 *                       type: string
 *                       example: "AAPL"
 *                     total_invested:
 *                       type: number
 *                       example: 4000
 *                     shares_bought:
 *                       type: number
 *                       example: 19.68600816969339
 *                     current_value:
 *                       type: number
 *                       example: 203.19
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-04T16:46:18.067Z"
 *                     __v:
 *                       type: number
 *                       example: 0
 *                 current_market_price:
 *                   type: string
 *                   example: "203.1900"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Investment not found"
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
router.get('/:investment_id', auth, investmentController.getInvestment);

/**
 * @swagger
 * /api/groups/{group_id}/investments:
 *   get:
 *     summary: Get all investments for a group
 *     description: Retrieves a list of all investments belonging to a specific group
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the group
 *     responses:
 *       200:
 *         description: List of investments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "67ee0818370e4b9484ea0d1c"
 *                   group_id:
 *                     type: string
 *                     example: "67d5ad9e3cc22e833a11dd32"
 *                   stock_symbol:
 *                     type: string
 *                     example: "IBM"
 *                   total_invested:
 *                     type: number
 *                     example: 1000
 *                   shares_bought:
 *                     type: number
 *                     example: 4.000320025602048
 *                   current_value:
 *                     type: number
 *                     example: 249.98
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-03T04:01:28.714Z"
 *                   __v:
 *                     type: number
 *                     example: 0
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Group not found"
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
router.get('/groups/:group_id/investments', auth, investmentController.getGroupInvestments);

/**
 * @swagger
 * /api/investments/{investment_id}/contributions:
 *   post:
 *     summary: Add a contribution to an investment
 *     description: Adds a new contribution to an existing investment
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: investment_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the investment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - amount
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID of the user making the contribution
 *               amount:
 *                 type: number
 *                 description: Amount to contribute
 *     responses:
 *       201:
 *         description: Contribution added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Contribution_id:
 *                   type: string
 *                   description: ID of the newly created contribution
 *       400:
 *         description: Bad request - Invalid input data
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Contribution not found"
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
router.post('/:investment_id/contributions', auth, investmentController.addContribution);

/**
 * @swagger
 * /api/investments/{investment_id}/returns:
 *   get:
 *     summary: Get investment returns
 *     description: Retrieves the current value and profit/loss of a specific investment
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: investment_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the investment
 *     responses:
 *       200:
 *         description: Investment returns retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 current_value:
 *                   type: number
 *                   description: Current value of the investment
 *                   example: 4500
 *                 profit_loss:
 *                   type: number
 *                   description: Profit or loss amount (negative for loss)
 *                   example: 500
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Investment not found"
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
router.get('/:investment_id/returns', auth, investmentController.getInvestmentReturns);

/**
 * @swagger
 * /api/investments/stock:
 *   get:
 *     summary: Get stocks
 *     description: Retrieves a list of available company stocks and their symbols
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company stock details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 103
 *                 stocks:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *                   example:
 *                     "Apple Inc.": "AAPL"
 *                     "Microsoft Corporation": "MSFT"
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
router.get('/stock/', auth, investmentController.getCompanyDetails);

module.exports = router;