const express = require('express');
const router = express.Router();
const settlementController = require('../controllers/settlementController');
const auth = require('../middleware/auth');

// @route   POST /api/settlements
// @desc    Create a new settlement
// @access  Private
router.post('/', auth, settlementController.createSettlement);

// @route   GET /api/settlements/{settlement_id}
// @desc    Get settlement details
// @access  Private
router.get('/:settlement_id', auth, settlementController.getSettlements);

module.exports = router;