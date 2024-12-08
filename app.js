import config from "#config/config.js";
import connectDB from "#config/database.js";
import globalErrorHandler from "#middlewares/error.middleware.js";
import categoryRoutes from "#routes/categories.route.js";
import subCategoryRoutes from "#routes/subcategory.route.js";
import brandRoutes from "#routes/brands.route.js";
import productRoutes from "#routes/products.route.js";
import ApiError from "#utils/api.error.js";
import Logger from "#utils/logger.js";
import express from "express";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static(join(__dirname, "uploads")));

if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
  Logger.debug("Development mode enabled");
}

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subCategoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);
// Not found middleware
app.all("*", (req, res, next) => {
  Logger.error(`Route not found: ${req.originalUrl}`);
  next(new ApiError(404, "Route not found"));
});

// Error handler middleware (should be last)
app.use(globalErrorHandler);

const server = app.listen(config.PORT, () => {
  Logger.info(`Server is running on port ${config.PORT}`);
});

// Unhandled rejection
process.on("unhandledRejection", (reason, promise) => {
  Logger.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
  server.close(() => {
    process.exit(1);
  });
});

// Uncaught exception
process.on("uncaughtException", (error) => {
  Logger.error(`Uncaught Exception: ${error}`);
  server.close(() => {
    Logger.error("Shutting down...");
    process.exit(1);
  });
});
