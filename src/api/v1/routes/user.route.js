import {
  createUser,
  deleteUser,
  getUserById,
  getUserBySlug,
  getUsers,
  updateUser,
} from "#controllers/user.controller.js";
import { generateSlug } from "#middlewares/slugify.middleware.js";
import userValidation from "#validations/user.validation.js";
import { Router } from "express";
import paginator from "#middlewares/paginator.js";
import { validate } from "#middlewares/validate.js";
import { uploadSingleImage, resizeImage } from "#middlewares/upload.images.js";
const router = Router();

router
  .route("/")
  .get(paginator(10), getUsers)
  .post(
    uploadSingleImage("profileImage"),
    validate(userValidation.createUser),
    generateSlug("name"),
    resizeImage("users", 600, 600),
    createUser
  );

router.get(
  "/slug/:slug",
  validate(userValidation.getUserBySlug),
  getUserBySlug
);

router
  .route("/:id")
  .get(validate(userValidation.getUserById), getUserById)
  .put(
    uploadSingleImage("profileImage"),
    validate(userValidation.updateUser),
    generateSlug("name"),
    resizeImage("users", 600, 600),
    updateUser
  )
  .delete(validate(userValidation.deleteUserById), deleteUser);

export default router;
