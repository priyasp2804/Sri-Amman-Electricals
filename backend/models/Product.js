import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Keeping string reference for display
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: true }, // Keeping string reference for display
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  lastRestockDate: { type: Date, default: Date.now },
  lastRestockQuantity: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;