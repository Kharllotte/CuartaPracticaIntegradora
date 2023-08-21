import mongoose from "mongoose";

const collectionName = "ticket";

const Schema = new mongoose.Schema({
  idCart:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts',
  },
  code: String,
  purchaseDateTime: { type: Date, default: Date.now },
  amount: String,
  purchaser: { type: String, require: true },
});

export const TicketModel = mongoose.model(collectionName, Schema);
