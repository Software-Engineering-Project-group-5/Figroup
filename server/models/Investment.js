const mongoose = require('mongoose');
const { Schema } = mongoose;

const investmentSchema = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  stock_symbol: { type: String, required: true },
  total_invested: { type: Number, required: true },
  shares_bought: { type: Number, default: 0 },
  current_value: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Investment', investmentSchema);