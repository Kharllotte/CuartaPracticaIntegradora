import { ProductModel } from "../../models/mongodb/products.js";
import logger from "../../../utils/logger/index.js";

export default class productManager {
  constructor() {}

  getAll = async (pageIn, limitIn, categoryIn, qIn, priceIn, sortIn) => {
    const page = parseInt(pageIn, 10) ?? 10;
    const limit = limitIn ? parseInt(limitIn, 10) : 10;
    const price = parseInt(priceIn, 10);

    let sort = { price: 1 };
    if (sortIn == "desc") {
      sort = {
        price: -1,
      };
    }

    const filter = {};

    if (categoryIn) filter.category = categoryIn;

    if (qIn) filter.title = qIn;

    if (price) filter.price = price;

    const products = await ProductModel.paginate(filter, {
      limit,
      page,
      sort,
    });

    logger.info("Get all products");

    return products;
  };

  getAllOutFilter = async () => {
    const products = await ProductModel.find({ active: true });
    return products;
  };

  getById = async (id) => {
    try {
      const product = await ProductModel.findOne({ _id: id });
      logger.info("Get product");
      return product;
    } catch (err) {
      logger.error("Failed get product");
      logger.error(err);
    }
  };

  add = async (product, user) => {
    try {
      const exist = await ProductModel.find({
        $or: [
          {
            title: product.productName,
          },
          {
            code: product.productCode,
          },
        ],
      });

      console.log(exist);

      if (exist.length > 0) {
        logger.warning("Already product exist");
        throw "Already product exist";
      }

      const owner = user.role == 'admin' ? 'admin' : user.email;

      const newProduct = {
        id: `${product.productName}${product.productCode}`,
        title: product.productName,
        description: product.productDescription,
        price: product.productPrice,
        code: product.productCode,
        stock: product.productStock,
        category: product.productCategory,
        active: true,
        owner
      };

      const result = await ProductModel.create(newProduct);
      logger.info("Product saved");
      return result;
    } catch (error) {
      logger.error(error);
    }
  };

  update = async (product) => {
    try {
      const newProduct = {
        title: product.productName,
        description: product.productDescription,
        price: product.productPrice,
        code: product.productCode,
        stock: product.productStock,
        category: product.productCategory,
        active: true,
      };

      let result = await ProductModel.findByIdAndUpdate(
        { _id: product._id },
        newProduct
      );

      logger.info("Product updated");
      return result;
    } catch (error) {
      logger.error("Get product");
    }
  };
}
