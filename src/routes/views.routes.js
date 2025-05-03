import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

export default function viewsRouter(io) {
    const router = Router();
    const pm = new ProductManager();

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

    return router;
}
