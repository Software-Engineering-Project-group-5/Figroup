const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/contributionController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/investments/{investment_id}/contributions:
 *   get:
 *     summary: Get all contributions for an investment
 *     description: Retrieves a list of all contributions associated with a specific investment
 *     tags: [Contributions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: investment_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the investment
 *     responses:
 *       200:
 *         description: List of contributions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Contribution ID
 *                   investment_id:
 *                     type: string
 *                     description: ID of the investment the contribution belongs to
 *                   user_id:
 *                     type: string
 *                     description: ID of the user who made the contribution
 *                   amount:
 *                     type: number
 *                     description: Amount contributed
 *                   group_id:
 *                     type: string
 *                     description: ID of the group associated with this contribution
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the contribution was created
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
router.get('/:investment_id/contributions', auth, contributionController.getContributions);

module.exports = router;