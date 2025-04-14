import StockHistory from "../models/StockHistory.js";

export const getStockHistory = async (req, res) => {
  try {
    let query = {};
    if (req.params.productName) {
      query = { 
        type: 'product',
        name: req.params.productName 
      };
    }
    const history = await StockHistory.find(query)
      .sort({ timestamp: -1 })
      .populate('employee');
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stock history", error: err });
  }
};