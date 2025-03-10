const mongoose = require('mongoose');
const { Schema } = mongoose;

const balanceSchema = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  balances: { type: Map, of: Number, default: new Map() }, // Tracks balances with other users
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Balance', balanceSchema);