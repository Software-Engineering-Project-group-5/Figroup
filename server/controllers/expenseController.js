const Group = require('../models/Group');
const Expense = require('../models/Expense');
const Balance = require('../models/Balance');

exports.createExpense = async (req, res) => {
  const { group_id, payer_id, amount, description, split_type, split_details } = req.body;
  try {
    const group = await Group.findById(group_id);
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    // Initialize split_details based on split_type
    let finalSplitDetails = split_details;
    if (split_type === 'EQUAL') {
      // Calculate equal shares for all group members
      const numMembers = group.members.length;
      const equalShare = amount / numMembers;

      finalSplitDetails = new Map();
      group.members.forEach((member) => {
        finalSplitDetails.set(member.toString(), equalShare);
      });
    }

    // Update balances for all users in the group
    for (const member of group.members) {
      const memberId = member.toString();

      // Find or create the balance document for the user in this group
      let balance = await Balance.findOne({ group_id, user_id: memberId });
      if (!balance) {
        balance = new Balance({ group_id, user_id: memberId, balances: new Map() });
      }

      if (memberId !== payer_id.toString()) {
        // Others owe money to the payer
        const amountOwed = finalSplitDetails.get(memberId);
        balance.balances.set(
          payer_id.toString(),
          (balance.balances.get(payer_id.toString()) || 0) - amountOwed
        );

        // Update payer's balance separately
        let payerBalance = await Balance.findOne({ group_id, user_id: payer_id });
        if (!payerBalance) {
          payerBalance = new Balance({ group_id, user_id: payer_id, balances: new Map() });
        }
        payerBalance.balances.set(
          memberId,
          (payerBalance.balances.get(memberId) || 0) + amountOwed
        );
        await payerBalance.save();
      }

      await balance.save();
    }

    // Create the expense
    const expense = new Expense({
      group_id,
      payer_id,
      amount,
      description,
      split_type,
      split_details: finalSplitDetails,
    });

    // Save the expense to the database
    await expense.save();

    // Add the expense to the group's expenses array
    group.expenses.push(expense._id);
    await group.save();

    res.json({ expense_id: expense._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Get expense details
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expense_id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all expenses for a group
exports.getGroupExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ group_id: req.params.group_id });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};