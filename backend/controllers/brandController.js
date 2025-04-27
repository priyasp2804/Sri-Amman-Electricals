import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import { saveStockHistory } from "../utils/saveStockHistory.js";

// Get all brands
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: "Error fetching brands", error });
  }
};

// Add a brand
export const addBrand = async (req, res) => {
  const { name } = req.body;
  try {
    const existing = await Brand.findOne({ name });
    if (existing) return res.status(400).json({ message: "Brand already exists" });

    const newBrand = new Brand({ name });
    await newBrand.save();

    await saveStockHistory({
      type: 'brand',
      name,
      action: 'added',
      employee: req.user
    }).catch(err => console.error('Failed to save brand history:', err));

    res.json({ message: "Brand added", brand: newBrand });
  } catch (error) {
    res.status(500).json({ message: "Error adding brand", error });
  }
};

export const updateBrand = async (req, res) => {
  const { name } = req.body;
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    const oldName = brand.name;

    const updated = await Brand.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    // Update categories that reference this brand
    await Category.updateMany(
      { brand: oldName },
      { $set: { brand: name } }
    );

    await saveStockHistory({
      type: 'brand',
      name: oldName,
      newName: name,
      action: 'edited',
      employee: req.user
    }).catch(err => console.error('Failed to save brand history:', err));

    res.json({ message: "Brand updated", brand: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating brand", error });
  }
};

// Delete brand – only allow deletion if no categories are associated with it
export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    const categoriesCount = await Category.countDocuments({
      brand: brand.name
    });

    if (categoriesCount > 0) {
      return res.status(400).json({
        message: "Cannot delete brand with associated categories",
        categoriesCount
      });
    }

    await Brand.findByIdAndDelete(req.params.id);

    await saveStockHistory({
      type: 'brand',
      name: brand.name,
      action: 'deleted',
      employee: req.user,
      affectedCategories: categoriesCount
    }).catch(err => {
      console.error('Stock History Save Failed:', err);
    });
    
    res.json({ message: "Brand deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting brand", error });
  }
};