// reportController.js
import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().select('name _id');
    res.json({ success: true, data: brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ success: false, message: 'Error fetching brands' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .select('name brand _id')
      .populate('brand', 'name _id');
    
    res.json({ 
      success: true, 
      data: categories.map(c => ({
        _id: c._id,
        name: c.name,
        brand: c.brand._id,
        brandName: c.brand.name
      }))
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching categories',
      error: error.message 
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select('name brandId categoryId quantity price lastRestockDate lastRestockQuantity itemsSoldAfterLastRestock')
      .populate('brandId', 'name')
      .populate('categoryId', 'name');
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
};

export const generateReport = async (req, res) => {
  try {
    const filters = req.body;
    const productQuery = buildProductQuery(filters);

    const products = await Product.find(productQuery)
      .populate('brandId', 'name')
      .populate('categoryId', 'name');

    const reportData = products.map(product => ({
      productName: product.name,
      brandName: product.brandId?.name || 'N/A',
      categoryName: product.categoryId?.name || 'N/A',
      quantity: product.quantity,
      price: product.price,
      lastRestockDate: product.lastRestockDate || null,
      lastRestockQuantity: product.lastRestockQuantity || 0
    }));

    res.json({ success: true, data: reportData });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error generating report' 
    });
  }
};

function buildProductQuery(filters) {
  let query = {};

  if (filters.product) {
    query._id = filters.product;
  } else {
    if (filters.brand) {
      query.brandId = filters.brand;
    }
    if (filters.category) {
      query.categoryId = filters.category;
    }
  }

  if (filters.minQuantity || filters.maxQuantity) {
    query.quantity = {};
    if (filters.minQuantity) query.quantity.$gte = Number(filters.minQuantity);
    if (filters.maxQuantity) query.quantity.$lte = Number(filters.maxQuantity);
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  return query;
}