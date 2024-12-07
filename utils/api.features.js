class ApiFeatures {
  /** @private */
  queryObj = {};

  /**
   * @param {import('mongoose').Query} query - Mongoose query object
   * @param {Object} queryString - Request query parameters
   * @param {Object} paginator - Pagination utility with getPagingData method
   */
    constructor(query, queryString, paginator) {
    if (!query || !queryString || !paginator) {
      throw new Error("ApiFeatures requires query, queryString and paginator");
    }

    this.query = query;
    this.queryString = queryString;
    this.paginator = paginator;
  }

  /**
   * Builds and chains query methods for API features
   * @returns {Promise<Object>} Paginated and filtered data
   */
  async execute() {
    try {
      // First apply base filters
      this.filter();

      // Then apply keyword search
      this.search(this.query.model.modelName);

      // Save queryObj for total count
      const countQuery = { ...this.queryObj };

      // Finally apply sort, fields and pagination which don't affect the count
      this.sort().limitFields().pagination();

      const [items, totalItems] = await Promise.all([
        this.query,
        this.query.model.countDocuments(countQuery),
      ]);

      return this.paginator.getPagingData(totalItems, items);
    } catch (error) {
      throw new Error(`Error executing API features: ${error.message}`);
    }
  }

  /**
   * Applies filtering based on query parameters
   * @private
   */
  filter() {
    this.queryObj = { ...this.queryString };
    const excludeFields = [
      "skip",
      "limit",
      "page",
      "sort",
      "filter",
      "fields",
      "keyword",
    ];
    excludeFields.forEach((el) => delete this.queryObj[el]);

    // Convert the query object to string
    let queryStr = JSON.stringify(this.queryObj);
    // Replace gte|gt|lte|lt with $gte|$gt|$lte|$lt
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Parse back to object and apply to query
    this.query = this.query.find(JSON.parse(queryStr));
    // Update queryObj for count
    this.queryObj = JSON.parse(queryStr);

    return this;
  }

  /**
   * Applies search functionality using keyword
   * @private
   */
  search(model) {
    if (this.queryString.keyword) {
      let keywordFilter = {};
      if (model === "Product") {
        keywordFilter = {
          $or: [
            { title: { $regex: this.queryString.keyword, $options: "i" } },
            {
              description: { $regex: this.queryString.keyword, $options: "i" },
            },
          ],
        };
      } else if (model === "Category") {
        keywordFilter = {
          name: { $regex: this.queryString.keyword, $options: "i" },
        };
      } else if (model === "Brand") {
        keywordFilter = {
          name: { $regex: this.queryString.keyword, $options: "i" },
        };
      } else if (model === "SubCategory") {
        keywordFilter = {
          name: { $regex: this.queryString.keyword, $options: "i" },
        };
      }

      // Combine existing filters with search filter using $and
      this.queryObj = {
        $and: [
          this.queryObj, // existing filters (quantity, ratingsAverage, etc.)
          keywordFilter, // search filter
        ],
      };

      // Apply updated queryObj to query
      this.query = this.query.find(this.queryObj);
    }
    return this;
  }

  /**
   * Applies sorting based on sort parameter
   * @private
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  /**
   * Limits fields in the response based on fields parameter
   * @private
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  /**
   * Applies pagination based on page and limit parameters
   * @private
   */
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;
