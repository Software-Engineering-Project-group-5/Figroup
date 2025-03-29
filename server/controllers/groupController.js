const Group = require('../models/Group');
const User = require('../models/User');

// Create a new group
exports.createGroup = async (req, res) => {
    const { name, type, admin_id } = req.body;
    try {
      // Create the group
      const group = new Group({
        name,
        type,
        admin_id,
        members: [admin_id], // Add the admin as the first member
      });
  
      // Save the group to the database
      await group.save();
  
      // Add the group to the admin's `groups` array
      const user = await User.findById(admin_id);
      if (user) {
        user.groups.push(group._id); // Add the group ID to the user's groups
        await user.save();
      }
  
      res.json({ group_id: group._id });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

// Get group details
exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.group_id)
      .populate('members', 'name email')
      .populate('expenses')
      .populate('investments');

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add a user to a group by email
exports.addMemberByEmail = async (req, res) => {
  const { group_id, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const group = await Group.findById(group_id);
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    if (group.members.includes(user._id)) {
      return res.status(400).json({ msg: 'User already in group' });
    }

    group.members.push(user._id);
    await group.save();

    user.groups.push(group._id);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Remove a user from a group
exports.removeMember = async (req, res) => {
  const { group_id, user_id } = req.params;
  try {
    const group = await Group.findById(group_id);
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    group.members = group.members.filter((member) => member.toString() !== user_id);
    await group.save();

    user.groups = user.groups.filter((group) => group.toString() !== group_id);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};