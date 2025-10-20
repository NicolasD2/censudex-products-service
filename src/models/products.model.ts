import {Schema, model} from 'mongoose';
import {v4 as uuidv4} from 'uuid';

const ProductSchema = new Schema({
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    category:{ type: String, required: true },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const ProductModel = model('Product', ProductSchema);