import { Router } from 'express';
import ProductManagerDB from '../managers/ProductManagerDB.js';

const router = Router();
const manager = new ProductManagerDB();

router.get('/', async (req, res) => {
    try {
        const result = await manager.getProducts(req.query);

        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
        const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${req.query.limit || 10}` : null;
        const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${req.query.limit || 10}` : null;

        res.json({
        status: result.status,
        payload: result.payload,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink,
        nextLink
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
    });

    router.get('/:pid', async (req, res) => {
    const product = await manager.getProductById(req.params.pid);
    product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
    });

    router.post('/', async (req, res) => {
    const product = await manager.addProduct(req.body);
    res.status(201).json(product);
    });

    router.put('/:pid', async (req, res) => {
    const updated = await manager.updateProduct(req.params.pid, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: 'Producto no encontrado' });
    });

    router.delete('/:pid', async (req, res) => {
    await manager.deleteProduct(req.params.pid);
    res.json({ message: 'Producto eliminado' });
    });
    

export default router;
