import { validationResult } from "express-validator";
import ApiResponse from "#utils/api.response.js";

export const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => err.msg);
    return res
      .status(400)
      .json(ApiResponse.error(400, extractedErrors.join(", ")));
  };
};
