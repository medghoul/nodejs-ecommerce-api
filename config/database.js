import { connect } from 'mongoose';
import config from '#config/config.js';
import Logger from '#utils/logger.js';

const connectDB = async () => {
    try {
        const conn = await connect(config.MONGO_URI, {
            dbName: config.DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
        });
        Logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        Logger.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;