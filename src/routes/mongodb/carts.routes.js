import { Router } from "express";
import cartsManager from "../../dao/managers/mongodb/carts.js";
import { generateCodeToken } from "../../utils/index.js";
import TicketsManager from "../../dao/managers/mongodb/tickets.js";
import authMiddleware from "../../helpers/auth.js";
import nodemailer from "nodemailer";
import helperMain from "../../helpers/index.js";
import logger from "../../utils/logger/index.js";

const carts = new cartsManager();
const tickets = new TicketsManager();

const cartsRouter = Router();

//Consultar todos los carritos
cartsRouter.get(
  "/",
  authMiddleware.isLoggedIn,
  authMiddleware.isAdmin,
  async (req, res) => {
    try {
      const getAllCarts = await carts.get();
      return res.json({
        result: "success",
        payload: getAllCarts,
      });
    } catch (error) {
      logger.error(error);
    }
  }
);

cartsRouter.get(
  "/:cid",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await carts.getById(cid);
      return res.json({
        result: "success",
        payload: cart,
      });
    } catch (error) {
      logger.error(error);
    }
  }
);

//Crear carrito con productos
cartsRouter.post(
  "/",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const query = {
        products: [],
      };
      const result = await carts.save(query);
      return res.status(201).json({ result: "succes", payload: result });
    } catch (err) {
      logger.error(err);
    }
  }
);

// Agregar un producto en el carrito
cartsRouter.post(
  "/:cid/products/:pid",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;

      const user = req.user;

      const result = await carts.saveProductInCart(cid, pid, user);

      if (result == "No stock") throw "No stock";

      return res.status(201).json({ result: "succes", payload: result });
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ result: "false", payload: err });
    }
  }
);

// Actualizar la cantidad de productos en el carrito
cartsRouter.put(
  "/:cid/products/:pid",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const amount = req.body.amount;

      const cart = await carts.getById(cid);

      if (!cart) logger.warning("Cart not found");

      const result = await carts.updateAmountProductsInCart(cart, pid, amount);
      if (result == "No stock") throw "No stock";
      return res.status(201).json({ result: "s;ucces", payload: result });
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ result: "false", payload: err });
    }
  }
);

// Borrar un producto especifico del carrito
cartsRouter.delete(
  "/:cid/products/:pid",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;

      const result = await carts.deleteProductInCart(cid, pid);
      return res.status(201).json({ result: "succes", payload: result });
    } catch (err) {
      logger.error(err);
    }
  }
);

// Borrar un carrito
cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await carts.delete(cid);
    return res.status(201).json({ result: "succes", payload: result });
  } catch (err) {
    logger.error(err);
  }
});

// Vaciar un carrito
cartsRouter.delete("/:cid/empty", async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await carts.empty(cid);
    return res.status(201).json({ result: "succes", payload: result });
  } catch (err) {
    logger.error(err);
  }
});

// Facturar
cartsRouter.post(
  "/:cid/purchase",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await carts.getById(cid);

      const productsNoStock = [];
      const productsBuy = [];
      const productsNoStockCart = { products: [] };
      let amount = 0;

      if (!cart) {
        return res.json({
          result: "false",
          payload: cart,
          message: "Cart no found",
        });
      }

      const products = cart.products;
      for (const product of products) {
        if (product.productId.stock < product.amount) {
          productsNoStock.push(product.productId);
          productsNoStockCart.products.push({
            productId: product.productId._id,
            amount: product.amount,
          });
        } else {
          product.productId.stock -= product.amount;
          await product.productId.save();
          amount += product.productId.price * product.amount;
          productsBuy.push({
            product: product.productId,
            amount: product.amount,
          });
        }
      }

      if (amount < 1) {
        return res.json({
          result: "false",
          payload: null,
          productsNoStock,
          newCart: null,
        });
      }

      const newTicket = {
        code: await generateCode(),
        purcharseDataTime: new Date(),
        amount,
        purcharser: req.user.email,
        idCart: cid,
      };

      const tk = await tickets.save(newTicket);

      const newCart = await carts.save(productsNoStockCart);

      req.user.cart = newCart._id;
      await req.user.save();

      await sendEmail(productsBuy, tk, req.user.email);

      return res.json({
        result: "true",
        payload: tk,
        productsNoStock,
        newCart,
      });
    } catch (error) {
      logger.error(error);
    }
  }
);

async function sendEmail(products, ticket, user) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_TOKEN,
    },
  });

  let productsBuy = "";
  products.forEach((p) => {
    productsBuy += `
    <div>
      Producto: ${p.product.title}, precio: $${p.product.price}
    </div>
    `;
  });

  const html = `
    <div>
      <small>Fecha: ${helperMain.formatDate(ticket.purchaseDateTime)}</small>
      <h3>Factura - Codigo: ${ticket.code}</h3>
      ${productsBuy}
      <br>
      <div>Total: $${ticket.amount}</div>
    </div>
  `;

  const mailOptions = {
    from: "lilikathe99@gmail.com",
    to: user,
    subject: "Asunto del correo",
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info("Correo electrónico enviado:", info.response);
  } catch (error) {
    logger.error("Error al enviar el correo:", error);
  }
}

const generateCode = async () => {
  const code = generateCodeToken();
  const tk = await tickets.getByCode(code);

  if (tk) generateCode();

  return code;
};

export default cartsRouter;
