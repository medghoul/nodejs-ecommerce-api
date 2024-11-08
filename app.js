import express from 'express';
import config from '#config/config.js';
import morgan from 'morgan';
import connectDB from '#config/database.js';
import categoryRoutes from '#routes/categories.route.js';
import Logger from '#utils/logger.js';
import ApiError from '#utils/api.error.js';
import globalErrorHandler from '#middleware/error.middleware.js';

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    Logger.debug('Development mode enabled');
}

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/v1/categories', categoryRoutes);

// Not found middleware
app.all('*', (req, res, next) => {
    Logger.error(`Route not found: ${req.originalUrl}`);
    next(new ApiError(404, 'Route not found'));
});

// Error handler middleware (should be last)
app.use(globalErrorHandler);

app.listen(config.PORT, () => {
    Logger.info(`Server is running on port ${config.PORT}`);
});