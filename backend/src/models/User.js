import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email."],
      unique: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: [8, "Password must contain at least 8 characters."],
    },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    passwordCreatedAt: Date,
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordCreatedAt = Date.now() - 1000;
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

userSchema.methods.passwordCreatedAfter = function (jwtIat) {
  if (!this.passwordCreatedAt) return false;
  const passwordTimestamp = Math.floor(this.passwordCreatedAt / 1000);
  return passwordTimestamp > jwtIat;
};

export default mongoose.model("User", userSchema);
