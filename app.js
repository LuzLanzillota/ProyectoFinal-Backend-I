import express from 'express';
import fs from 'fs';
import ProductManager from './ProductManagr.js';
import CartManager from './CartManager.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

const perfumes = [
    {
        id: 1,
        title: "L'Interdit",
        description: "Perfume femenino floral con notas de azahar, jazmín y pachuli.",
        code: "INT001",
        price: 58000,
        status: true,
        stock: 20,
        category: "F",
        thumbnails: ["https://example.com/interdit.jpg"]
    },
    {
        id: 2,
        title: "Bleu de Chanel",
        description: "Perfume masculino amaderado con notas cítricas, incienso y sándalo.",
        code: "BDC002",
        price: 69000,
        status: true,
        stock: 15,
        category: "M",
        thumbnails: ["https://example.com/bleu.jpg"]
    },
    {
        id: 3,
        title: "La Vie Est Belle",
        description: "Aroma dulce y sofisticado con iris, jazmín y praliné.",
        code: "LVB003",
        price: 62000,
        status: true,
        stock: 18,
        category: "F",
        thumbnails: ["https://example.com/lavie.jpg"]
    },
    {
        id: 4,
        title: "Dior Sauvage",
        description: "Perfume intenso con bergamota, pimienta y ambroxan.",
        code: "SAV004",
        price: 71000,
        status: true,
        stock: 25,
        category: "M",
        thumbnails: ["https://example.com/sauvage.jpg"]
    },
    {
        id: 5,
        title: "Good Girl",
        description: "Perfume femenino oriental floral con haba tonka y cacao.",
        code: "GDG005",
        price: 57000,
        status: true,
        stock: 12,
        category: "F",
        thumbnails: ["https://example.com/goodgirl.jpg"]
    },
    {
        id: 6,
        title: "Aventus Creed",
        description: "Perfume de lujo con piña, bergamota y almizcle.",
        code: "AVT006",
        price: 150000,
        status: true,
        stock: 5,
        category: "M",
        thumbnails: ["https://example.com/aventus.jpg"]
    },
    {
        id: 7,
        title: "My Way",
        description: "Perfume fresco y floral con vainilla, almendra y flor de azahar.",
        code: "MYW007",
        price: 56000,
        status: true,
        stock: 14,
        category: "F",
        thumbnails: ["https://example.com/myway.jpg"]
    },
    {
        id: 8,
        title: "Invictus",
        description: "Perfume con notas acuáticas, ámbar gris y laurel.",
        code: "INV008",
        price: 63000,
        status: true,
        stock: 20,
        category: "M",
        thumbnails: ["https://example.com/invictus.jpg"]
    },
    {
        id: 9,
        title: "Idôle",
        description: "Perfume luminoso con rosa, jazmín y almizcle blanco.",
        code: "IDL009",
        price: 59000,
        status: true,
        stock: 16,
        category: "F",
        thumbnails: ["https://example.com/idole.jpg"]
    },
    {
        id: 10,
        title: "Acqua di Gio",
        description: "Aroma marino clásico con lima, jazmín y cedro.",
        code: "ADG010",
        price: 60000,
        status: true,
        stock: 22,
        category: "M",
        thumbnails: ["https://example.com/acquadigio.jpg"]
    }
];

//Productos

//Inicio con los productos

app.get('/api/products/', (req, res) => {
    res.json(perfumes);
})


// Devuelve el producto por el id que se le pasa

app.get('/api/products/:pid', (req, res) => {
    let idIngresado = Number(req.params.pid);
    const idFiltrado = perfumes.find(perfumes => perfumes.id === idIngresado)

    if (!idFiltrado) {
        return res.status(404).json({ error: "Perfume no encontrado" })
    }
    res.json({ idFiltrado })
})

// Crea un producto nuevo

app.post('/api/products/', (req, res) => {
    const perfume = req.body;
    if (!perfume.title || !perfume.description || !perfume.code || !perfume.price || !perfume.status || !perfume.stock || !perfume.category || !perfume.thumbnails) {
        return res.status(400).send({
            status: "error",
            error: "Tenes que completar todos los campos para poder agregar un producto."
        })
    }
    perfume.id = perfumes.length + 1;
    perfumes.push(perfume);
    res.status(201).send({
        status: "Exitoso",
        message: "Perfume creado correctamente",
        perfume
    });
})

//Cambia un producto por el id

app.put('/api/products/:pid', (req, res) => {
    const idDeProductoACambiar = Number(req.params.pid);
    let productoActualizado = req.body;

    const indexDeProducto = perfumes.findIndex(perfume => perfume.id === idDeProductoACambiar);


    if (indexDeProducto === -1)
        return res.status(404).send({
            status: "error",
            error: "Producto no encontrado"
        })
    perfumes[indexDeProducto] = {
        ...perfumes[indexDeProducto],
        ...productoActualizado
    };
    res.send({
        status: "Exitoso",
        message: "Perfume correctamente actualizado",
    })
})

//Borra un producto por el id

app.delete('/api/products/:pid', (req, res) => {
    const idDeProductoABorrar = Number(req.params.pid);
    const indexDeProductoABorrar = perfumes.findIndex(perfume => perfume.id === idDeProductoABorrar);


    if (indexDeProductoABorrar === -1)
        return res.status(404).send({
            status: "error",
            error: "Producto no encontrado"
        })

    perfumes.splice(indexDeProductoABorrar, 1);
    res.send({
        status: "Exitoso",
        message: "Perfume borrado correctamente",
    })
})



//Carrito
let cart = [];
let nextCartId = 1;
app.post('/api/carts/', (req, res) => {
    let newCart = {
        id: nextCartId++,
        products: []
    }

    cart.push(newCart);
    res.status(201).json({ mensaje: "Carrito creado exitosamente", cart: newCart });
})

app.get('/api/carts/:cid', (req, res) => {
    const cid = Number(req.params.cid);
    const carritoEncontrado = cart.find(c => c.id === cid);

    if (!carritoEncontrado) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json({
        mensaje: "Productos del carrito encontrados",
        productos: carritoEncontrado.products
    });
})

app.post('/api/carts/:cid/product/:pid', (req, res) => {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);

    // Buscar el producto en la lista de perfumes
    const producto = perfumes.find(p => p.id === pid);
    if (!producto) return res.status(404).json({ error: "Producto no existe" });

    // Buscar el carrito
    const carrito = cart.find(c => c.id === cid);
    if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });

    // Ver si el producto ya está en el carrito
    const productoEnCarrito = carrito.products.find(p => p.product === pid);
    if (productoEnCarrito) {
        productoEnCarrito.quantity += 1;
    } else {
        carrito.products.push({ product: pid, quantity: 1 });
    }

    res.json({ mensaje: "Producto agregado correctamente", cart: carrito });
});



app.listen(8080, () => console.log("Listo para recibir peticiones"))
