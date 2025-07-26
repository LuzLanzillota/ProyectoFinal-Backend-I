import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./data/products.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    const pid = Number(req.params.id);
    const product = await productManager.getProductById(pid);
    product ? res.json(product) : res.status(404).json({ error: 'Perfume no encontrado' });
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    const perfume = req.body;
    const camposObligatorios = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];

    const faltanCampos = camposObligatorios.some(campo => !perfume[campo]);
    if (faltanCampos) {
        return res.status(400).json({
            status: "error",
            error: "Tenes que completar todos los campos para poder agregar un producto."
        });
    }

    try {
        const nuevoProducto = await productManager.addProduct(perfume);
        res.status(201).json({
            status: "Exitoso",
            message: "Perfume creado correctamente",
            perfume: nuevoProducto
        });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

// Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
    const idDeProductoACambiar = Number(req.params.pid);
    const productoActualizado = req.body;

    try {
        const productoExistente = await productManager.getProductById(idDeProductoACambiar);
        if (!productoExistente) {
            return res.status(404).json({
                status: "error",
                error: "Producto no encontrado"
            });
        }

        await productManager.updateProduct(idDeProductoACambiar, productoActualizado);
        res.json({
            status: "Exitoso",
            message: "Perfume correctamente actualizado"
        });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

// Eliminar producto
router.delete('/:pid', async (req, res) => {
    const result = await productManager.deleteProduct(Number(req.params.pid));
    res.json(result);
});

export default router;

