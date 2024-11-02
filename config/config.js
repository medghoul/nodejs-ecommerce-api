import dotenv from 'dotenv';
dotenv.config();

export default {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    API_VERSION: '/api/v1'
};
