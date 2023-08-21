import mongoose from "mongoose";

const passwordResetName = "passwordReset";

const passwordReset = new mongoose.Schema({
  id: { type: String, require: true },
  url: { type: String, default: Date.now, requiere: true },
  date: { type: String, default: Date.now, requiere: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  active: { type: Boolean, default: true, requiere: true },
});

export const PasswordResetModel = mongoose.model(
  passwordResetName,
  passwordReset
);
