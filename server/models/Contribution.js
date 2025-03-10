const mongoose = require('mongoose');
const { Schema } = mongoose;

const contributionSchema = new Schema({
  investment_id: { type: Schema.Types.ObjectId, ref: 'Investment', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contribution', contributionSchema);