import { Router } from "express";
import productManager from "../../dao/managers/mongodb/products.js";
import authMiddleware from "../../helpers/auth.js";
import logger from "../../utils/logger/index.js";

const product = new productManager();
const productRouter = Router();

/**
 * Metodo para obtener los productos con filtros opcionales de:
 * page, limit, category, title (q), price y sort.
 */
// productRouter.get("/", authMiddleware.isLoggedIn, async (req, res) => {
//   const page = req.query.page;
//   const limit = req.query.limit;
//   const category = req.query.category;
//   const q = req.query.q;
//   const price = req.query.price;
//   const sort = req.query.sort;

//   try {
//     const payload = await product.getAll(page, limit, category, q, price, sort);
//     return res.json({
//       result: "success",
//       payload,
//     });
//   } catch (error) {
//     logger.error(error)
//   }
// });

productRouter.get("/", authMiddleware.isLoggedIn, async (req, res) => {
  try {
    const payload = await product.getAllOutFilter();
    return res.json({
      result: "success",
      payload,
    });
  } catch (error) {
    logger.error(error);
  }
});

productRouter.get("/:id", authMiddleware.isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    const payload = await product.getById(id);
    return res.json({
      result: "success",
      payload,
    });
  } catch (error) {
    logger.error(error);
  }
});

productRouter.post(
  "/add",
  authMiddleware.isLoggedIn,
  authMiddleware.isAdminOrPremium,
  async (req, res) => {
    try {
      const user = req.user;
      const payload = req.body;
      const newProduct = await product.add(payload, user);
      return res.json({
        result: "success",
        payload: newProduct,
      });
    } catch (error) {
      logger.error(error);
    }
  }
);

productRouter.post(
  "/update",
  authMiddleware.isLoggedIn,
  authMiddleware.isAdminOrPremium,
  async (req, res) => {
    try {
      const payload = req.body;
      const productUp = await product.update(payload);
      return res.json({
        result: "success",
        payload: productUp,
      });
    } catch (error) {
      console.log(error);
      logger.error(error);
    }
  }
);

productRouter.post(
  "/inactive/:id",
  authMiddleware.isLoggedIn,
  authMiddleware.isAdminOrPremium,
  async (req, res) => {
    try {
      const id = req.params.id;
      const getProduct = await product.getById(id);
      if (!getProduct) throw "Product not found";
      const user = req.user;

      if (user.role == "premium") {
        if (user.email == getProduct.owner) {
          getProduct.active = false;
          await getProduct.save();
        } else throw "No allowed";
      } else {
        getProduct.active = false;
        await getProduct.save();
      }

      return res.json({
        success: true,
        payload: getProduct,
      });
    } catch (error) {
      logger.error(error);
    }
  }
);

export default productRouter;
