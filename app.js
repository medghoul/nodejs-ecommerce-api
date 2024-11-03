import express from 'express';
import config from '#config/config.js';
import morgan from 'morgan';
import connectDB from '#config/database.js';
import categoryRoutes from '#routes/categories.route.js';
import Logger from '#utils/logger.js';

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

// Error handler middleware (should be last)
app.use((err, req, res, next) => {
    Logger.error(`Error: ${err.message}`);
    res.status(500).json({ message: err.message });
});

app.listen(config.PORT, () => {
    Logger.info(`Server is running on port ${config.PORT}`);
});