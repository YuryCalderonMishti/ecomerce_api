import fs from 'fs/promises';
const path = './src/data/products.json';

export default class ProductManager {
    async getProducts() {
        try {
            const data = await fs.readFile(path, 'utf-8');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            if (error.code === 'ENOENT') return []; 
            throw error;
        }
    }
    

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(prod => prod.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const id = Date.now().toString();
        const newProduct = { id, ...product };
        products.push(newProduct);
        await fs.writeFile(path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(prod => prod.id === id);
        if (index === -1) throw new Error(`El producto con ID ${id} no existe`);
        products[index] = { ...products[index], ...updates, id }; // no cambia el id
        await fs.writeFile(path, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const newProducts = products.filter(prod => prod.id !== id);
        await fs.writeFile(path, JSON.stringify(newProducts, null, 2));
    }
}
