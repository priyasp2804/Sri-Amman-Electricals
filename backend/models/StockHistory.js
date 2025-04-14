import mongoose from 'mongoose';

const stockHistorySchema = new mongoose.Schema({
  type: { type: String, enum: ['product', 'category', 'brand'], required: true },
  name: { type: String, required: true },
  newName: { type: String }, // For brand/category renames
  action: { type: String, enum: ['added', 'edited', 'deleted'], required: true },
  employee: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    role: String
  },
  previousQuantity: { type: Number },
  newQuantity: { type: Number },
  category: { type: String },
  brand: { type: String },
  affectedProducts: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const StockHistory = mongoose.models.StockHistory || mongoose.model('StockHistory', stockHistorySchema);
export default StockHistory;