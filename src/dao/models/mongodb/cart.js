import mongoose from "mongoose";

const cartName = "carts";

const cartSchema = new mongoose.Schema({
  id: { type: String, require: true },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
      },
      amount: {
        type: Number,
        default: 1
      }
    }
  ]
});

export const CartModel = mongoose.model(cartName, cartSchema);

export default { cartSchema };
