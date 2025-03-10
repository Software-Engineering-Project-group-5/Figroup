const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  payer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  split_type: { type: String, enum: ['EQUAL', 'CUSTOM'], required: true },
  split_details: { type: Map, of: Number },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Expense', expenseSchema);