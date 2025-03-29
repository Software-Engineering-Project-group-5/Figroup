const mongoose = require('mongoose');
const { Schema } = mongoose;

const settlementSchema = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  from_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who owes money
  to_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who is owed money
  status: { type: String, enum: ['PENDING', 'COMPLETED'], default: 'PENDING' }, // Settlement status
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Settlement', settlementSchema);