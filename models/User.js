const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already present"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already present"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profilePic: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
    bio: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
