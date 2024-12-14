import { Schema, model } from "mongoose";
import { setImageUrl } from "#middlewares/set.image.url.js";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      unique: [true, "Name must be unique"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [32, "Name must be at most 32 characters long"],
    },
    // Slug is a unique identifier for the category
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: [true, "Slug must be unique"],
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

CategorySchema.post("init", setImageUrl("categories").init);
CategorySchema.post("save", setImageUrl("categories").save);

export default model("Category", CategorySchema);
