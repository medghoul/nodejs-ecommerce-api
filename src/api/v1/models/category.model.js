import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [32, "Name must be at most 32 characters long"]
    },
    // Slug is a unique identifier for the category
    slug: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String
    }
  },
  { timestamps: true }
);

export default model("Category", CategorySchema);
