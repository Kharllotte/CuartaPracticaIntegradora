import mongoose from "mongoose";

const nameCollection = "messages";

const messageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  message: { type: String, require: true },
  date: { type: Date, default: Date.now },
});

export const messageModel = mongoose.model(nameCollection, messageSchema);
