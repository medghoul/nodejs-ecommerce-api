import ApiResponse from '#utils/apiResponse.js';

const paginator = (defaultItemsPerPage = 10) => (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || defaultItemsPerPage;
    
    if (page < 1 || limit < 1) {
        return res.status(400).json(
            ApiResponse.error(400, 'Page and limit must be positive numbers')
        );
    }

    const skip = (page - 1) * limit;

    req.pagination = {
        page,
        limit,
        skip,
        getPagingData: (totalItems, items) => ({
            totalItems,
            items,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            itemsPerPage: limit,
            hasNextPage: page * limit < totalItems,
            hasPreviousPage: page > 1
        })
    };

    next();
};

export default paginator;
