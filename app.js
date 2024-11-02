import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/database';
import categoryRoutes from './api/v1/routes/categories.route';

const app = express();

// Load env vars
config();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/v1/categories', categoryRoutes);

// Error handler middleware (should be last)
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});