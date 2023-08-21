import {promises as fs} from 'fs'
import { nanoid } from 'nanoid'

class ProductManager {
    constructor(){
        this.path = "./src/dao/models/fileSystem/products.json"
        // this.path ="/Users/LILIANA/Documents/BACK/proyecto final/src/controllers/ProductsManager.js"
    }

    readProducts = async () => {
        let products = await fs.readFile(this.path, "utf-8")
        return JSON.parse(products)
    }

    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product))
    }

    exist = async (id) => {
        let products = await this.readProducts();
        return products.find(prod => prod.id === id)
    }

    addProducts = async (product) => {
        let productsOld = await this.readProducts()
        product.id = nanoid()
        let productAll = [...productsOld, product]
        await this.writeProducts(productAll)
        return "Producto Agregado";
    };

    getProducts = async () => {
        return await this.readProducts()
    };
    
    getProductsById = async (id) => {
        let productById = await this.exist(id)
        if(!productById) return "Producto No Encontrado"
        return productById
    };

    updateProduct = async (id, product) => {
        let productById = await this.exist(id)
        if(!productById) return "Producto No Encontrado"
        await this.deleteProduct(id)
        let productsOld = await this.readProducts()
        let products = [{...product, id : id}, ...productsOld]
        await this.writeProducts(products)
        return "Producto Actualizado Exitosamente"
    }

    deleteProduct = async (id) => {
        let products = await this.readProducts();
        let existProduct = products.some(prod => prod.id === id)
        if (existProduct){
            let filterProducts = products.filter(prod => prod.id != id)
            await this.writeProducts(filterProducts)
            return "Producto Eliminado"
        }
        return "Producto No Existe "
        
    }
}

export default ProductManager

