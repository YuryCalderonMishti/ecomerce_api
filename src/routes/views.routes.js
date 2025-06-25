import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import ProductManagerDB from '../managers/ProductManagerDB.js';
import CartManagerDB from '../managers/CartManagerDB.js';

export default function viewsRouter(io) {
    const router = Router();
    const pm = new ProductManager();
    const pmDB = new ProductManagerDB();
    const cartManager = new CartManagerDB();

    // Ruta para la vista principal 'home'
    router.get('/', async (req, res) => {
        const products = await pm.getProducts();
        res.render('home', { title: 'Home', products });
    });

    // Ruta para la vista 'realTimeProducts'
    router.get('/realtimeproducts', async (req, res) => {
        const products = await pm.getProducts();
        res.render('realTimeProducts', { title: 'Real Time Products' });

        // Enviar la lista de productos a los clientes conectados
        io.emit('products', products);

        // Configuración de WebSocket para añadir y eliminar productos
        io.on('connection', socket => {
        socket.on('addProduct', async data => {
            await pm.addProduct({ 
            ...data, 
            description: '', 
            code: '', 
            status: true, 
            stock: 1, 
            category: '', 
            thumbnails: [] 
            });
            const updated = await pm.getProducts();
            io.emit('updateProducts', updated);
        });

        socket.on('deleteProduct', async id => {
            await pm.deleteProduct(id);
            const updated = await pm.getProducts();
            io.emit('updateProducts', updated);
        });
        });
    });

    router.get('/products', async (req, res) => {
        try {
            const result = await pmDB.getProducts(req.query);

            console.log('📦 Resultado de productos paginados:', result);

            res.render('products', {
                title: 'Productos',
                products: result.payload,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                currentPage: result.page
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar productos');
        }
    });

    router.get('/products/:pid', async (req, res) => {
        const product = await pmDB.getProductById(req.params.pid);
        if (!product) return res.status(404).send('Producto no encontrado');
        res.render('productDetail', { product });
    });

    router.get('/carts/:cid', async (req, res) => {
        const cart = await cartManager.getCartById(req.params.cid);
        res.render('cart', {
            products: cart.products,
            title: 'Carrito'
        });
    });

    return router;
}
