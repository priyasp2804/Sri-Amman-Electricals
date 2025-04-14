import StockHistory from '../models/StockHistory.js';

export const saveStockHistory = async ({
  type,
  name,
  action,
  employee,
  previousQuantity,
  newQuantity,
  category,
  brand,
  newName,
  affectedProducts
}) => {
  try {
    const historyEntry = {
      type: type?.toLowerCase(),      // 🔁 convert to lowercase
      action: action?.toLowerCase(),  // 🔁 convert to lowercase
      name,
      employee: employee && employee._id
        ? {
            _id: employee._id,
            name: employee.name,
            role: employee.role
          }
        : {
            _id: null,
            name: "System",
            role: "System"
          },
      previousQuantity: previousQuantity || 0,
      newQuantity: newQuantity || 0,
      category: category || null,
      brand: brand || null,
      newName: newName || null,
      affectedProducts: affectedProducts || 0,
      timestamp: new Date()
    };

    await StockHistory.create(historyEntry);
  } catch (err) {
    console.error("Failed to log stock history:", err);
    throw err;
  }
};
