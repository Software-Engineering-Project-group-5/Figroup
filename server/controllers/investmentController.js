const Investment = require('../models/Investment');
const Group = require('../models/Group');

// Create a new investment
exports.createInvestment = async (req, res) => {
  const { group_id, stock_symbol, amount_per_user } = req.body;
  try {
    const group = await Group.findById(group_id);
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    const investment = new Investment({
      group_id,
      stock_symbol,
      total_invested: amount_per_user * group.members.length,
      shares_bought: 0,
      current_value: 0,
    });

    await investment.save();
    res.json({ investment_id: investment._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get investment details
exports.getInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.investment_id);
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }
    res.json(investment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all investments for a group
exports.getGroupInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ group_id: req.params.group_id });
    res.json(investments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add a contribution to an investment
exports.addContribution = async (req, res) => {
  const { user_id, amount } = req.body;
  try {
    const investment = await Investment.findById(req.params.investment_id);
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }

    const contribution = new Contribution({
      investment_id: investment._id,
      user_id,
      amount,
    });

    await contribution.save();
    res.json({ contribution_id: contribution._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get investment returns
exports.getInvestmentReturns = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.investment_id);
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }

    const profitLoss = investment.current_value - investment.total_invested;
    res.json({ current_value: investment.current_value, profit_loss: profitLoss });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};