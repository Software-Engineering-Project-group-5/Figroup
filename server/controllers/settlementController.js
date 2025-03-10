const Settlement = require('../models/Settlement');
const Balance = require('../models/Balance');

// Create a settlement
exports.createSettlement = async (req, res) => {
  const { group_id, from_user_id, to_user_id } = req.body;
  try {
    // Find the balances for both users
    const fromUserBalance = await Balance.findOne({ group_id, user_id: from_user_id });
    const toUserBalance = await Balance.findOne({ group_id, user_id: to_user_id });

    if (!fromUserBalance || !toUserBalance) {
      return res.status(404).json({ msg: 'Balances not found' });
    }

    // Check if the from_user owes the to_user
    const amountOwed = fromUserBalance.balances.get(to_user_id.toString()) || 0;
    if (amountOwed >= 0) {
      return res.status(400).json({ msg: 'No debt to settle' });
    }

    // Create the settlement record
    const settlement = new Settlement({
      group_id,
      from_user_id,
      to_user_id,
      status: 'COMPLETED',
    });

    await settlement.save();

    // Update balances
    fromUserBalance.balances.set(to_user_id.toString(), 0); // Reset the debt to 0
    toUserBalance.balances.set(from_user_id.toString(), (toUserBalance.balances.get(from_user_id.toString()) || 0) + Math.abs(amountOwed));

    await fromUserBalance.save();
    await toUserBalance.save();

    res.json({ settlement_id: settlement._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all settlements for a group
exports.getSettlements = async (req, res) => {
    const { group_id } = req.params;
    try {
      const settlements = await Settlement.find({ group_id })
        .populate('from_user_id', 'name email')
        .populate('to_user_id', 'name email');
  
      res.json(settlements);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };