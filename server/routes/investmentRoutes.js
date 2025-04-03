const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const auth = require('../middleware/auth');

// @route   POST /api/investments
// @desc    Create a new investment
// @access  Private
router.post('/', auth, investmentController.createInvestment);

// @route   GET /api/investments/{investment_id}
// @desc    Get investment details
// @access  Private
router.get('/:investment_id', auth, investmentController.getInvestment);

// @route   GET /api/groups/{group_id}/investments
// @desc    Get all investments for a group
// @access  Private
router.get('/groups/:group_id/investments', auth, investmentController.getGroupInvestments);

// @route   POST /api/investments/{investment_id}/contributions
// @desc    Add a contribution to an investment
// @access  Private
router.post('/:investment_id/contributions', auth, investmentController.addContribution);

// @route   GET /api/investments/{investment_id}/returns
// @desc    Get investment returns
// @access  Private
router.get('/:investment_id/returns', auth, investmentController.getInvestmentReturns);

// @route   GET /api/investments/stock
// @desc    Get sotcks
// @access  Private
router.get('/stock/', auth, investmentController.getCompanyDetails);

module.exports = router;