const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['EXPENSE', 'INVESTMENT'], required: true },
  admin_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense' }], // Array of Expense references
  investments: [{ type: Schema.Types.ObjectId, ref: 'Investment' }], // Array of Investment references
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', groupSchema);