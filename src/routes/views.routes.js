import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import ProductManagerDB from '../managers/ProductManagerDB.js';
import CartManagerDB from '../managers/CartManagerDB.js';

export default function viewsRouter(io) {
    const router = Router();
    const pm = new ProductManager();
    const pmDB = new ProductManagerDB();
    const cartManager = new CartManagerDB();

    // Home con productos de archivo (no DB)
    router.get('/', async (req, res) => {
        try {
            const products = await pm.getProducts();
            res.render('home', { title: 'Home', products });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar home');
        }
    });

    // Vista tiempo real
    router.get('/realtimeproducts', async (req, res) => {
        try {
            const products = await pm.getProducts();
            res.render('realTimeProducts', { title: 'Real Time Products' });

            io.emit('products', products);

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
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar productos en tiempo real');
        }
    });

    // Productos paginados
    router.get('/products', async (req, res) => {
        try {
            const result = await pmDB.getProducts(req.query);
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

    // Detalle producto
    router.get('/products/:pid', async (req, res) => {
        try {
            const product = await pmDB.getProductById(req.params.pid);
            if (!product) return res.status(404).send('Producto no encontrado');
            res.render('productDetail', { product });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar detalle');
        }
    });

    // Carrito
    router.get('/carts/:cid', async (req, res) => {
        try {
            const cart = await cartManager.getCartById(req.params.cid);
            if (!cart) return res.status(404).send('Carrito no encontrado');
            res.render('cart', {
                products: cart.products,
                title: 'Carrito'
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar carrito');
        }
    });

    return router;
}
