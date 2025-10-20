import {ProductModel} from '../models/products.model';
import { CloudinaryService } from './cloudinary.service';

export class ProductsService {
    private cloudinary=new CloudinaryService();

    async create(data, fileBuffer: Buffer){
        const existing = await ProductModel.findOne({name: data.name});
        if(existing){
            throw new Error('El nombre del producto ya existe.');
        }
        let imageUrl = null;
        let imagePublicId = null;

        if(fileBuffer){
            const result: any = await this.cloudinary.uploadImage(fileBuffer, 'products');
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        }

        const product = new ProductModel({
            ...data,
            imageUrl,
            imagePublicId,
            isActive: true,
        });
        return product.save();
    }
    async findAll(filters={}){
        const query = { isActive: true, ...filters };
        return ProductModel.find(query);
    }
    async findById(id: string){
        const product = await ProductModel.findOne({id, isActive: true});
        if(!product){
            throw new Error('Producto no encontrado.');
        }
        return product;
    }
    async update(id: string, data, fileBuffer?: Buffer){
        const product = await ProductModel.findOne({id});
        if(!product){
            throw new Error('Producto no encontrado.');
        }
        if(data.name && data.name !== product.name){
            const existing = await ProductModel.findOne({name: data.name});
            if(existing){
                throw new Error('El nombre del producto ya existe.');
            }
        }
        if(fileBuffer){
            if(product.imagePublicId){
                await this.cloudinary.deleteImage(product.imagePublicId);
            }
            const result: any = await this.cloudinary.uploadImage(fileBuffer, 'products');
            product.imageUrl = result.secure_url;
            product.imagePublicId = result.public_id;
        }
        Object.assign(product, data);
        return product.save();
    }
    async softDelete(id: string){
        const product = await ProductModel.findOne({id});
        if(!product){
            throw new Error('Producto no encontrado.');
        }
        product.isActive = false;
        return product.save();
    }
}