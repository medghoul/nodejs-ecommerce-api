import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Product title is required"],
      minlength: [3, "Product title must be at least 3 characters long"],
      maxlength: [100, "Product title must be at most 100 characters long"],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [
        10,
        "Product description must be at least 10 characters long",
      ],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Product price must be at most 20 digits"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: {
      type: [String],
    },
    images: {
      type: [String],
    },
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
