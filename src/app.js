import express from 'express';
import fs from 'fs';
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';
import productsRouter from './routers/products-router.js';
import cartsRouter from './routers/carts-router.js';



const app = express();
const PORT = 8080;


app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

const productManager = new ProductManager('./data/products.json');
const cartManager = new CartManager('./data/carts.json');






app.listen(PORT, () => console.log("Listo para recibir peticiones"))
