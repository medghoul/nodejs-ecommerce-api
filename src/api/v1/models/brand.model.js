import { Schema, model } from "mongoose";

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      unique: [true, "Name must be unique"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [32, "Name must be at most 32 characters long"],
    },
    // Slug is a unique identifier for the brand
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

export default model("Brand", BrandSchema);
