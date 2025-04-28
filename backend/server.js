import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import stockHistoryRoutes from "./routes/stockHistoryRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

connectDB();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:4200',
    /^https:\/\/sri-amman-electricals-.*\.vercel\.app$/,
    'https://sri-amman-electricals.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Handle CORS preflight and normal requests
app.use(cors(corsOptions));

// Parse incoming JSON body
app.use(express.json());

// Simple home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Sri Amman Electricals API",
  });
});

// Mount Routes
app.use("/api/owners", ownerRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock-history", stockHistoryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/reports", reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Endpoint not found' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
