const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require('../middleware/auth');

// @route   POST /api/groups
// @desc    Create a new group
// @access  Private
router.post('/', auth, groupController.createGroup);

// @route   GET /api/groups/{group_id}
// @desc    Get group details
// @access  Private
router.get('/:group_id', auth, groupController.getGroup);

// @route   POST /api/groups/{group_id}/members
// @desc    Add a user to a group by email
// @access  Private
router.post('/:group_id/members', auth, groupController.addMemberByEmail);

// @route   DELETE /api/groups/{group_id}/members/{user_id}
// @desc    Remove a user from a group
// @access  Private
router.delete('/:group_id/members/:user_id', auth, groupController.removeMember);

module.exports = router;