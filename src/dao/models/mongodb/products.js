import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollectionName = "products";

const productSchema = new mongoose.Schema({
  id: { type: String, require: true },
  title: { type: String, require: true },
  description: { type: String, require: true },
  category: { type: String, require: true },
  price: { type: Number, require: true },
  code: { type: Number, require: true },
  stock: { type: Number, require: true },
  active: { type: Boolean, require: true },
  owner: { type: String, default: "admin", require: true },
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model(
  productCollectionName,
  productSchema
);

export default { productSchema };
