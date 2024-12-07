import { Schema, model } from "mongoose";

const SubCategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      unique: [true, "Sub category name must be unique"],
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [32, "Name must be at most 32 characters long"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: [true, "Slug must be unique"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Sub category must belong to a category"],
    },
  },
  { timestamps: true }
);

SubCategorySchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name _id" });
  next();
});

export default model("SubCategory", SubCategorySchema);
