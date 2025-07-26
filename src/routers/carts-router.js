import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const cartManager = new CartManager('./data/carts.json');
const productManager = new ProductManager('./data/products.json');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ mensaje: "Carrito creado exitosamente", cart: newCart });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito", detalle: error.message });
    }
});

// Obtener productos de un carrito por ID
router.get('/:cid', async (req, res) => {
    const cid = Number(req.params.cid);

    try {
        const carrito = await cartManager.getCartById(cid);

        if (!carrito) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.status(200).json({
            mensaje: "Productos del carrito encontrados",
            productos: carrito.products
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito", detalle: error.message });
    }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);

    try {
        // Validar que el producto exista
        const producto = await productManager.getProductById(pid);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Agregar el producto al carrito
        const carritoActualizado = await cartManager.addProductToCart(cid, pid);
        if (!carritoActualizado) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.json({ mensaje: "Producto agregado correctamente", cart: carritoActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto al carrito", detalle: error.message });
    }
});

export default router;
