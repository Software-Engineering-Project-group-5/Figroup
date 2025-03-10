const Contribution = require('../models/Contribution');
const Investment = require('../models/Investment');

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

    // Update the investment's total_invested
    investment.total_invested += amount;
    await investment.save();

    res.json({ contribution_id: contribution._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all contributions for an investment
exports.getContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({ investment_id: req.params.investment_id });
    res.json(contributions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};