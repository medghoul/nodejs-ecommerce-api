import Logger from '#utils/logger.js';
import ApiResponse from '#utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
    Logger.error(`Error: ${err.message}`);

    if (err.name === 'ValidationError') {
        return res.status(400).json(
            ApiResponse.error(400, err.message)
        );
    }

    if (err.name === 'CastError') {
        return res.status(400).json(
            ApiResponse.error(400, 'Invalid ID format')
        );
    }

    if (err.code === 11000) {
        return res.status(409).json(
            ApiResponse.error(409, 'Duplicate field value entered')
        );
    }

    return res.status(500).json(
        ApiResponse.error(500, 'Internal server error')
    );
}; 