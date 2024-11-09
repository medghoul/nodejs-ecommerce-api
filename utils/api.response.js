class ApiResponse {
    constructor(success, statusCode, message, data = null) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }

    static success(statusCode, message, data) {
        return new ApiResponse(true, statusCode, message, data);
    }

    static error(statusCode, message) {
        return new ApiResponse(false, statusCode, message);
    }
}

export default ApiResponse;
