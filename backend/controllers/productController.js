import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import { saveStockHistory } from "../utils/saveStockHistory.js";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('brandId', 'name')
      .populate('categoryId', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.category });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({ categoryId: category._id })
      .populate('brandId', 'name')
      .populate('categoryId', 'name');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products by category", error });
  }
};

// Update getProductsByBrandAndCategory to use IDs
export const getProductsByBrandAndCategory = async (req, res) => {
  try {
    const brand = await Brand.findOne({ name: req.params.brand });
    const category = await Category.findOne({ 
      name: req.params.category,
      brand: brand?._id 
    });

    if (!brand || !category) {
      return res.status(404).json({ message: "Brand or category not found" });
    }

    const products = await Product.find({
      brandId: brand._id,
      categoryId: category._id
    }).populate('brandId', 'name')
      .populate('categoryId', 'name');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const { name, brand, category, quantity, price } = req.body;

    // Validate required fields
    if (!name || !brand || !category || quantity === undefined || price === undefined) {
      return res.status(400).json({ 
        message: "All fields are required",
        missingFields: {
          name: !name,
          brand: !brand,
          category: !category,
          quantity: quantity === undefined,
          price: price === undefined
        }
      });
    }

    // Find brand and category
    const brandDoc = await Brand.findOne({ name: brand });
    if (!brandDoc) {
      return res.status(400).json({ message: "Brand not found" });
    }

    const categoryDoc = await Category.findOne({ 
      name: category,
      brand: brandDoc._id
    });
    if (!categoryDoc) {
      return res.status(400).json({ message: "Category not found for this brand" });
    }

    // Check for existing product
    const existing = await Product.findOne({ 
      name,
      brandId: brandDoc._id,
      categoryId: categoryDoc._id
    });
    if (existing) {
      return res.status(400).json({ 
        message: "Product already exists for this brand and category",
        existingProduct: existing
      });
    }

    // Create new product
    const newProduct = new Product({
      name,
      brand: brandDoc.name,
      brandId: brandDoc._id,
      category: categoryDoc.name,
      categoryId: categoryDoc._id,
      quantity: Number(quantity),
      price: Number(price),
      lastRestockDate: new Date(),
      lastRestockQuantity: Number(quantity),
      addedBy: req.user.id
    });

    const savedProduct = await newProduct.save();

    // Save stock history
    await saveStockHistory({
      type: "product",
      name,
      action: "added",
      employee: req.user,
      previousQuantity: 0,
      newQuantity: Number(quantity),
      category: categoryDoc.name,
      brand: brandDoc.name
    }).catch(err => {
      console.error('Failed to save stock history:', err);
    });

    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      message: "Error adding product",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { name, quantity, price } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const previousQuantity = product.quantity;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        name,
        quantity,
        price,
        lastRestockQuantity: quantity - product.quantity,
        lastRestockDate: new Date(),
        updatedBy: req.user.id
      },
      { new: true }
    ).populate('brandId', 'name')
     .populate('categoryId', 'name');

    // Save stock history
    await saveStockHistory({
      type: "product",
      name,
      action: "edited",
      employee: req.user,
      previousQuantity,
      newQuantity: quantity,
      category: updated.category,
      brand: updated.brand
    }).catch(err => {
      console.error('Failed to save stock history:', err);
    });

    res.json({ message: "Product updated", product: updated });

  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Save stock history
    await saveStockHistory({
      type: "product",
      name: product.name,
      action: "deleted",
      employee: req.user,
      previousQuantity: product.quantity,
      newQuantity: 0,
      category: product.category,
      brand: product.brand
    }).catch(err => {
      console.error('Failed to save stock history:', err);
    });

    res.json({ message: "Product deleted" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};