import productManager from "../mongodb/products.js";
import { CartModel } from "../../models/mongodb/cart.js";
import { ProductModel } from "../../models/mongodb/products.js";
import logger from "../../../utils/logger/index.js";

const products = new productManager();

export default class CartManagerM {
  constructor() {}

  save = async (cart) => {
    try {
      let result = await CartModel.create(cart);
      logger.info("Cart saved");
      return result;
    } catch (error) {
      logger.error(error);
      logger.error("Failed card saved");
    }
  };

  saveProductInCart = async (cid, pid, user) => {
    try {
      const cart = await this.getById(cid);
      if (!cart) {
        logger.warning("Cart no found");
        return;
      }

      const product = await products.getById(pid);

      if (!product) {
        logger.warning("Product no found");
        return;
      }

      if (product.stock < 1) {
        logger.warning("No stock");
        return "No stock";
      }

      if (product.owner == user.email) {
        logger.error("Owner product");
        throw 'Owner product'
      }

      const query = {
        productId: product,
        amount: 1,
      };

      cart.products.push(query);

      logger.info("Product saved in cart");
      return await cart.save();
    } catch (error) {
      logger.error(error);
      logger.error("Failed card saved");
    }
  };

  get = async () => {
    try {
      const carts = await CartModel.find().populate("products.productId");
      logger.info("Get all success");
      return carts;
    } catch (err) {
      logger.error(err);
      logger.error("Get all success error");
    }
  };

  delete = async (id) => {
    try {
      const result = await CartModel.deleteOne({ _id: id });
      logger.info("Cart deleted");
      return result;
    } catch (error) {
      logger.error("Failed card delete");
      logger.error(error);
    }
  };

  empty = async (id) => {
    try {
      const result = await this.getById(id);
      if (!result) {
        logger.warning("Cart not found");
        return;
      }

      result.products = [];
      logger.info("Cart empty");
      return await result.save();
    } catch (error) {
      logger.error("Failed card delete");
      logger.error(error);
    }
  };

  deleteProductInCart = async (cid, pid) => {
    try {
      const result = await CartModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { productId: pid } } },
        { new: true }
      ).populate("products.productId");
      logger.info("Deleted product in cart success");
      return result;
    } catch (error) {
      logger.error(error);
      logger.error("Failed product remove in cart");
    }
  };

  getById = async (id) => {
    try {
      const cart = await CartModel.findOne({ _id: id })
        .populate({ path: "products.productId", match: { active: true } })
        .exec();

      cart.products = cart.products.filter(
        (product) => product.productId !== null
      );
      logger.info("Get cart");
      return cart;
    } catch (err) {
      logger.error("Failed get cart");
      logger.error(err);
    }
  };

  updateAmountProductsInCart = async (cart, pid, amount) => {
    try {
      if (!amount > 0) {
        return this.deleteProductInCart(cart._id, pid);
      }

      const productIndex = cart.products.findIndex(
        (product) => product.productId._id.toString() == pid
      );

      if (productIndex === -1) {
        logger.warning("El producto no se encuentra en el carrito.");
        return null;
      }

      const stock = cart.products[productIndex].productId.stock;

      if (stock < amount) {
        logger.warning("No stock");
        return "No stock";
      }

      cart.products[productIndex].amount = amount;

      logger.info("Cart update");

      return cart.save();
    } catch (err) {
      //     throw new Error(err?.message);
      logger.error(err);
      logger.error("no es posible agregar el producto al carrito");
    }
  };

  updateCart = async (cid, pid, productUpdate) => {
    try {
      let result = await ProductModel.findByIdAndUpdate(
        { _id: cid, _id: pid },
        productUpdate
      );
      
      logger.info("Cart update");
      
      return result;
    } catch (error) {
      logger.error(error);
      logger.error("erro al actualizar el carrito");
    }
  };
}
