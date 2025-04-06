const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies
 *     description: Fetches all available companies for investment with their stock symbols.
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Operation success status
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: Total number of companies available
 *                   example: 103
 *                 stocks:
 *                   type: object
 *                   description: Map of company names to their stock symbols
 *                   additionalProperties:
 *                     type: string
 *                   example:
 *                     "Apple Inc.": "AAPL"
 *                     "Microsoft Corporation": "MSFT"
 *                     "Alphabet Inc. (Google)": "GOOGL"
 *                     "Amazon.com Inc.": "AMZN"
 *                     "NVIDIA Corporation": "NVDA"
 *                     "Meta Platforms Inc.": "META"
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Token is not valid"
 */
router.get('/', auth, investmentController.getCompanyDetails);

module.exports = router;