const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', userController.register);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', userController.login);

// @route   GET /api/users/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get('/profile', auth, userController.getProfile);

// @route   GET /api/users/{user_id}
// @desc    Get user details
// @access  Private
router.get('/:user_id', auth, userController.getUser);

// @route   PUT /api/users/{user_id}
// @desc    Update user details
// @access  Private
router.put('/:user_id', auth, userController.updateUser);

// @route   GET /api/users/{user_id}/summary
// @desc    Get user summary (total owed, total to receive, expense breakdown)
// @access  Private
router.get('/:user_id/summary', auth, userController.getUserSummary);

// @route   GET /api/users/{user_id}/investments/summary
// @desc    Get user investments summary (total invested, contribution to invested breakdown)
// @access  Private
router.get('/:user_id/investments/summary', auth, userController.getInvestmentSummary);

module.exports = router;