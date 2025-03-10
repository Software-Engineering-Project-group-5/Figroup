const User = require('../models/User');
const Group = require('../models/Group');
const Expense = require('../models/Expense');
const Investment = require('../models/Investment');

// Get user summary (total owed, total to receive, expense breakdown)
exports.getUserSummary = async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get all expenses where the user is involved
    const expenses = await Expense.find({
      $or: [
        { payer_id: user._id }, // User paid for these expenses
        { 'split_details.user_id': user._id }, // User owes money for these expenses
      ],
    });

    let totalOwed = 0;
    let totalToReceive = 0;

    expenses.forEach((expense) => {
      if (expense.payer_id.toString() === user._id.toString()) {
        // User paid for this expense, so they are owed money
        totalToReceive += expense.amount;
      } else {
        // User owes money for this expense
        const userShare = expense.split_details.get(user._id.toString());
        if (userShare) {
          totalOwed += userShare;
        }
      }
    });

    res.json({
      total_owed: totalOwed,
      total_to_receive: totalToReceive,
      expense_breakdown: expenses,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get group financial summary
exports.getGroupReport = async (req, res) => {
  try {
    const group = await Group.findById(req.params.group_id)
      .populate('members', 'name email')
      .populate('expenses')
      .populate('investments');

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    // Calculate total expenses and investments for the group
    const totalExpenses = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalInvestments = group.investments.reduce((sum, investment) => sum + investment.total_invested, 0);

    res.json({
      group_id: group._id,
      total_expenses: totalExpenses,
      total_investments: totalInvestments,
      members: group.members,
      expenses: group.expenses,
      investments: group.investments,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get investment performance
exports.getInvestmentPerformance = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.investment_id);
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }

    const profitLoss = investment.current_value - investment.total_invested;
    res.json({
      current_value: investment.current_value,
      profit_loss: profitLoss,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};