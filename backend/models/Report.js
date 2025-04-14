import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  filters: {
    type: new mongoose.Schema({
      brand: String,
      category: String,
      product: String,
      minQuantity: Number,
      maxQuantity: Number,
      minPrice: Number,
      maxPrice: Number
    }, { _id: false }),
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    type: [new mongoose.Schema({
      productName: String,
      brandName: String,
      categoryName: String,
      quantity: Number,
      price: Number,
      lastRestockDate: Date,
      lastRestockQuantity: Number
    }, { _id: false })],
    default: []
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
reportSchema.index({ generatedBy: 1 });
reportSchema.index({ createdAt: -1 }); // For sorting by generation time

const Report = mongoose.model("Report", reportSchema);
export default Report;