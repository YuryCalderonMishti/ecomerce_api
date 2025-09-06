import { Router } from 'express';
import CartManagerDB from '../managers/CartManagerDB.js';

const router = Router();
const manager = new CartManagerDB();

// Crear carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await manager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear carrito' });
    }
});

// Obtener carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await manager.getCartById(req.params.cid);
        cart
            ? res.json(cart.products)
            : res.status(404).json({ error: 'Carrito no encontrado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener carrito' });
    }
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const updatedCart = await manager.addProductToCart(req.params.cid, req.params.pid);
        updatedCart
            ? res.json(updatedCart)
            : res.status(404).json({ error: 'Carrito o producto no encontrado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

// Actualizar carrito completo
router.put('/:cid', async (req, res) => {
    try {
        if (!req.body.products) {
            return res.status(400).json({ error: 'Debes enviar un arreglo de productos' });
        }
        const updatedCart = await manager.updateCart(req.params.cid, req.body.products);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// Actualizar cantidad de producto en carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
        }
        const updatedCart = await manager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const updatedCart = await manager.deleteProductFromCart(req.params.cid, req.params.pid);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// Vaciar carrito
router.delete('/:cid', async (req, res) => {
    try {
        const updatedCart = await manager.deleteAllProducts(req.params.cid);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

export default router;
