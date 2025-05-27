import mongoose from 'mongoose';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';

export default class CartManagerDB {
    async createCart() {
        const newCart = new Cart({ products: [] });
        return await newCart.save();
    }

    async getCartById(cid) {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            throw new Error('ID de carrito inválido');
        }
        return await Cart.findById(cid).populate('products.product').lean();
    }

    async addProductToCart(cid, pid) {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            throw new Error('ID de carrito inválido');
        }
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            throw new Error('ID de producto inválido');
        }

        const cart = await Cart.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const productExists = await Product.findById(pid);
        if (!productExists) throw new Error('Producto no encontrado');

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        return await cart.save();
    }

    async updateCart(cid, products) {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            throw new Error('ID de carrito inválido');
        }

        // Validar que products sea un array con la estructura correcta
        if (!Array.isArray(products)) {
            throw new Error('Productos debe ser un arreglo');
        }
        for (const item of products) {
            if (
                !item.product ||
                !mongoose.Types.ObjectId.isValid(item.product) ||
                typeof item.quantity !== 'number' ||
                item.quantity < 1
            ) {
                throw new Error('Estructura de producto inválida');
            }
            // Validar que el producto exista en la base de datos
            const productExists = await Product.findById(item.product);
            if (!productExists) {
                throw new Error(`Producto con id ${item.product} no existe`);
            }
        }

        const cart = await Cart.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = products;
        return await cart.save();
    }

    async updateProductQuantity(cid, pid, quantity) {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            throw new Error('ID de carrito inválido');
        }
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            throw new Error('ID de producto inválido');
        }
        if (typeof quantity !== 'number' || quantity < 1) {
            throw new Error('Cantidad inválida');
        }

        const cart = await Cart.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const productInCart = cart.products.find(p => p.product.toString() === pid);
        if (!productInCart) throw new Error('Producto no encontrado en el carrito');

        productInCart.quantity = quantity;
        return await cart.save();
    }

    async deleteProductFromCart(cid, pid) {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            throw new Error('ID de carrito inválido');
        }
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            throw new Error('ID de producto inválido');
        }

        const cart = await Cart.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        return await cart.save();
    }

    async deleteAllProducts(cid) {
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            throw new Error('ID de carrito inválido');
        }

        const cart = await Cart.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = [];
        return await cart.save();
    }
}

