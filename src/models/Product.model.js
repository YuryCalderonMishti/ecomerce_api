import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    category: String,
    status: { type: Boolean, default: true },
    thumbnails: [String]
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;
