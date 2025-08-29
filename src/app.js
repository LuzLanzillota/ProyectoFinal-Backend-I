import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';
import productsRouter from './routers/products-router.js';
import cartsRouter from './routers/carts-router.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use(express.static('./public')); // para servir JS del cliente

// Handlebars config
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

const productManager = new ProductManager('./data/products.json');

// Rutas vistas
app.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

// Websockets
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Enviar productos iniciales
    socket.emit('productos', productManager.getProducts());

    // Escuchar nuevo producto
    socket.on('nuevoProducto', (producto) => {
        const nuevo = productManager.addProduct(producto);
        io.emit('productos', productManager.getProducts()); // actualiza a todos
    });

    // Escuchar eliminación
    socket.on('eliminarProducto', (id) => {
        productManager.deleteProduct(Number(id));
        io.emit('productos', productManager.getProducts());
    });
});

httpServer.listen(PORT, () => console.log("Servidor escuchando en puerto " + PORT));
