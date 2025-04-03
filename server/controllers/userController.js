const User = require('../models/User');
const Group = require('../models/Group');
const Expense = require('../models/Expense');
const Balance = require('../models/Balance')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Contribution = require('../models/Contribution');
const Investment = require('../models/Investment');

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password_hash: await bcrypt.hash(password, 10),
    });

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ user_id: user.id, token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    //const payload = { user: { id: user.id } };
    jwt.sign({ user: { _id: user.id } }, process.env.JWT_SECRET, { expiresIn: '6h' }, (err, token) => {
      if (err) throw err;
      res.json({
          token,
          user: { _id: user.id }
      });
  });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user details by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserSummary = async (req, res) => {
  try {
      const user = await User.findById(req.params.user_id);
      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

      // Get all groups the user is part of
      const groups = await Group.find({ members: user._id, type: "EXPENSE" });

      // Calculate group-wise balances
      const groupBalances = await Promise.all(
          groups.map(async (group) => {
              // Get balance document for the user in this group
              const balance = await Balance.findOne({ group_id: group._id, user_id: user._id });

              let totalOwed = 0; // Total amount the user owes
              let totalToReceive = 0; // Total amount the user is owed
              let owesTo = []; // List of users the user owes money to
              let getsFrom = []; // List of users who owe money to the user

              if (balance && balance.balances) {
                  for (const [otherUserId, amount] of balance.balances.entries()) {
                      if (amount < 0) {
                          // User owes money
                          totalOwed += Math.abs(amount);
                          owesTo.push({ user_id: otherUserId, amount: Math.abs(amount) });
                      } else if (amount > 0) {
                          // User is owed money
                          totalToReceive += amount;
                          getsFrom.push({ user_id: otherUserId, amount });
                      }
                  }
              }

              return {
                  group_id: group._id,
                  group_name: group.name,
                  total_owed: totalOwed,
                  total_to_receive: totalToReceive,
                  owes_to: owesTo,
                  gets_from: getsFrom
              };
          })
      );

      res.json({groupBalances,"name":user.name});
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
};

exports.getInvestmentSummary = async (req, res) => {
  try {
    // Add await to properly resolve the user query
    const user = await User.findById(req.params.user_id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find all investment groups the user is a member of
    const groups = await Group.find({ members: user._id, type: "INVESTMENT" });
    
    const groupContributions = await Promise.all(
      groups.map(async (group) => {
        // Get all investments for this group
        const investments = await Investment.find({ group_id: group._id });
        
        // Calculate total invested across all investments in this group
        const totalGroupInvestment = investments.reduce((total, investment) => {
          return total + investment.total_invested;
        }, 0);
        
        // Get all contributions by this user for this group
        const userContributions = await Contribution.find({ 
          group_id: group._id, 
          user_id: user._id // Fixed to use user._id consistently
        });
        
        // Calculate total contributed by this user
        const userTotalContribution = userContributions.reduce((total, contribution) => {
          return total + contribution.amount;
        }, 0);
        
        return {
          group_id: group._id,
          group_name: group.name,
          total_group_investment: totalGroupInvestment,
          user_contribution: userTotalContribution
        };
      })
    );
    
    res.json({
      user_id: user._id,
      name: user.name,
      groupContributions: groupContributions
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
