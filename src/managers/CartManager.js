import fs from 'fs/promises';
const path = './src/data/carts.json';

export default class CartManager {
    async getCarts() {
        const data = await fs.readFile(path, 'utf-8');
        return JSON.parse(data);
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: Date.now().toString(), products: [] };
        carts.push(newCart);
        await fs.writeFile(path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return null;

        const product = cart.products.find(p => p.product === productId);
        if (product) {
        product.quantity += 1;
        } else {
        cart.products.push({ product: productId, quantity: 1 });
        }

        await fs.writeFile(path, JSON.stringify(carts, null, 2));
        return cart;
    }
    }
