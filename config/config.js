import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Logger from '../utils/logger.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../config.env') });

Logger.info(`NODE_ENV: ${JSON.stringify(process.env.NODE_ENV)}`);
Logger.info(`PORT: ${JSON.stringify(process.env.PORT)}`);
Logger.info(`DB_URI: ${JSON.stringify(process.env.DB_URI)}`);

export default {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.DB_URI,
    API_VERSION: '/api/v1',
    DB_NAME: process.env.DB_NAME
};
