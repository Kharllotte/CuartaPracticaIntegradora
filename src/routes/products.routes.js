import { Router } from 'express';
import ProductManager from "../controllers/ProductManager.js";

const productRouter = Router();
const product = new ProductManager();

productRouter.get("/", async (req, res) => {
    res.send(await product.getProducts())
})

productRouter.get("/:id", async (req, res) => {
    let id = req.params.id;
    res.send(await product.getProductsById(id));
})

productRouter.post("/", async (req, res) => {
    let newProduct = req.body;
    res.send(await product.addProducts(newProduct));
})

productRouter.put("/:id", async (req, res) => {
    let id = req.params.id;
    let updateProduct = req.body;
    res.send(await product.updateProduct(id, updateProduct));
})

productRouter.delete("/:id", async (req, res) => {
    let id = req.params.id;
    res.send(await product.deleteProduct(id));
})

export default productRouter