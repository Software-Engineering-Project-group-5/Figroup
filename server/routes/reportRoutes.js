const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

// @route   GET /api/users/{user_id}/summary
// @desc    Get user summary (total owed, total to receive, expense breakdown)
// @access  Private
router.get('/users/:user_id/summary', auth, reportController.getUserSummary);

// @route   GET /api/groups/{group_id}/report
// @desc    Get group financial summary
// @access  Private
router.get('/groups/:group_id/report', auth, reportController.getGroupReport);

// @route   GET /api/investments/{investment_id}/performance
// @desc    Get investment performance (current value, profit/loss)
// @access  Private
router.get('/investments/:investment_id/performance', auth, reportController.getInvestmentPerformance);

module.exports = router;