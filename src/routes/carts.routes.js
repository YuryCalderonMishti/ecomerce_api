import { Router } from 'express';
import CartManagerDB from '../managers/CartManagerDB.js';

const router = Router();
const manager = new CartManagerDB();

router.post('/', async (req, res) => {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
    });

    router.get('/:cid', async (req, res) => {
    const cart = await manager.getCartById(req.params.cid);
    cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
    });

    router.post('/:cid/product/:pid', async (req, res) => {
    const updatedCart = await manager.addProductToCart(req.params.cid, req.params.pid);
    updatedCart ? res.json(updatedCart) : res.status(404).json({ error: 'Carrito no encontrado' });
    });
    
    router.put('/:cid', async (req, res) => {
        try {
            const updatedCart = await manager.updateCart(req.params.cid, req.body.products);
            res.json(updatedCart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const updatedCart = await manager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    });

    router.delete('/:cid/products/:pid', async (req, res) => {
        try {
            const updatedCart = await manager.deleteProductFromCart(req.params.cid, req.params.pid);
            res.json(updatedCart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    
    router.delete('/:cid', async (req, res) => {
        try {
            const updatedCart = await manager.deleteAllProducts(req.params.cid);
            res.json(updatedCart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

export default router;
