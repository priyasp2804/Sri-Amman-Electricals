import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import Product from "../models/Product.js";
import { saveStockHistory } from "../utils/saveStockHistory.js";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('brand', 'name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// Get categories by brand
export const getCategoriesByBrand = async (req, res) => {
  try {
    const brand = await Brand.findOne({ name: req.params.brand });
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    const categories = await Category.find({ brand: brand._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories by brand", error });
  }
};

// Add a category
export const addCategory = async (req, res) => {
  const { name, brand } = req.body;
  try {
    const brandDoc = await Brand.findOne({ name: brand });
    if (!brandDoc) return res.status(404).json({ message: "Brand not found" });

    const existing = await Category.findOne({ name, brand: brandDoc._id });
    if (existing) return res.status(400).json({ message: "Category already exists for this brand" });

    const newCategory = new Category({ name, brand: brandDoc._id });
    await newCategory.save();

    await saveStockHistory({
      type: 'category',
      name,
      brand: brandDoc.name,
      action: 'added',
      employee: req.user
    }).catch(err => console.error('Failed to save category history:', err));

    res.json({ message: "Category added", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Error adding category", error });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const oldName = category.name;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    // Update products with the new category name
    await Product.updateMany(
      { category: oldName },
      { $set: { category: name } }
    );

    const brand = await Brand.findById(category.brand);

    await saveStockHistory({
      type: 'category',
      name: oldName,
      newName: name,
      brand: brand?.name,
      action: 'edited',
      employee: req.user
    }).catch(err => console.error('Failed to save category history:', err));

    res.json({ message: "Category updated", category: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Check for associated products
    const productsCount = await Product.countDocuments({ category: category.name });

    if (productsCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete category with associated products",
        productsCount
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    const brand = await Brand.findById(category.brand);

    await saveStockHistory({
      type: 'category',
      name: category.name,
      brand: brand?.name,
      action: 'deleted',
      employee: req.user,
      affectedProducts: productsCount
    }).catch(err => console.error('Failed to save category history:', err));

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};