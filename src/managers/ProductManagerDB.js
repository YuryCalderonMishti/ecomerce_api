import Product from '../models/Product.model.js';

export default class ProductManagerDB {
    async getProducts({ limit = 10, page = 1, sort, query }) {
        const filter = {};

        if (query) {
            filter.$or = [
                { category: { $regex: query, $options: 'i' } }
            ];

            if (query === 'true' || query === 'false') {
                filter.$or.push({ status: query === 'true' });
            }
        }

        const sortOptions = sort === 'asc' ? { price: 1 } :
                            sort === 'desc' ? { price: -1 } : {};

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOptions,
            lean: true
        };

        const result = await Product.paginate(filter, options);

        return {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}` : null
        };
    }

    async getProductById(id) {
        return await Product.findById(id).lean();
    }

    async addProduct(productData) {
        return await Product.create(productData);
    }

    async updateProduct(id, updates) {
        return await Product.findByIdAndUpdate(id, updates, { new: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}
