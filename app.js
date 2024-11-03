import express from 'express';
import config from './config/config.js';
import morgan from 'morgan';
import connectDB from './config/database.js';
import categoryRoutes from './src/api/v1/routes/categories.route.js';

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log('Development mode');
}

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/v1/categories', categoryRoutes);

// Error handler middleware (should be last)
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});