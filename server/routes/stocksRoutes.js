const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const auth = require('../middleware/auth');

// @route   GET /api/companies
// @desc    Get companies
// @access  Private
router.get('/', auth, investmentController.getCompanyDetails);

module.exports = router;