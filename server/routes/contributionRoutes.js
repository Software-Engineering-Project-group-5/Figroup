const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/contributionController');
const auth = require('../middleware/auth');

// @route   POST /api/investments/{investment_id}/contributions
// @desc    Add a contribution to an investment
// @access  Private
router.post('/:investment_id/contributions', auth, contributionController.addContribution);

// @route   GET /api/investments/{investment_id}/contributions
// @desc    Get all contributions for an investment
// @access  Private
router.get('/:investment_id/contributions', auth, contributionController.getContributions);

module.exports = router;