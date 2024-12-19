import { Schema, model } from "mongoose";
import { setImageUrl } from "#middlewares/set.image.url.js";
const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    slug: {
      type: String,
      trim: true,
      required: [true, "Slug is required"],
      unique: [true, "Slug must be unique"],
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone is required"],
      unique: [true, "Phone must be unique"],
      lowercase: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

UserSchema.post("init", setImageUrl("users").init);
UserSchema.post("save", setImageUrl("users").save);

export default model("User", UserSchema);
