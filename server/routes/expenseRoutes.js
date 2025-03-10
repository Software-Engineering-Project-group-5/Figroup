const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', auth, expenseController.createExpense);

// @route   GET /api/expenses/{expense_id}
// @desc    Get expense details
// @access  Private
router.get('/:expense_id', auth, expenseController.getExpense);

// @route   GET /api/groups/{group_id}/expenses
// @desc    Get all expenses for a group
// @access  Private
router.get('/groups/:group_id/expenses', auth, expenseController.getGroupExpenses);

module.exports = router;