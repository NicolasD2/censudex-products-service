import { of } from 'rxjs';
import {ProductModel} from '../models/products.model';
import { CloudinaryService } from './cloudinary.service';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

    async create(data:any, fileBuffer?: Buffer){

        try{
            const existing = await ProductModel.findOne({name: data.name});
            if(existing){
                throw new Error('El nombre del producto ya existe.');
            }
            let imageUrl = null;
            let imagePublicId = null;

            if(fileBuffer){
                const result: any = await this.cloudinaryService.uploadImageFromBuffer(fileBuffer, 'products');
                imageUrl = result.secure_url;
                imagePublicId = result.public_id;
            }
            const product = new ProductModel({
                ...data,
                imageUrl,
                imagePublicId,
                isActive: true,
            });

            return await product.save();
        } catch (error) {
            if(error instanceof ConflictException){
                throw error;
            }throw new Error('Error al crear el producto: ' + error.message);
        }
    }

    async findAll(filters={}){
        try{
            const query = { isActive: true, ...filters };
            return await ProductModel.find(query);
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }

    async findById(id: string){
        try {
            const product = await ProductModel.findOne({id, isActive: true});
            if(!product){
                throw new Error('Producto no encontrado.');
            }
            return product;
        } catch (error) {
            throw new Error('Error al obtener el producto: ' + error.message);
        }
    }
    async update(id: string, data, fileBuffer?: Buffer){
        try {
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
                    await this.cloudinaryService.deleteImage(product.imagePublicId);
                }
                const result: any = await this.cloudinaryService.uploadImageFromBuffer(fileBuffer, 'products');
                product.imageUrl = result.secure_url;
                product.imagePublicId = result.public_id;
            }
            Object.assign(product, data);
            return await product.save();
    } catch (error) {
            throw new Error('Error al actualizar el producto: ' + error.message);
        }
    }

    async softDelete(id: string){
        try {

            const product = await ProductModel.findOne({id});
            if(!product){
                throw new Error('Producto no encontrado.');
            }
            product.isActive = false;
            return await product.save();
        } catch (error) {
            throw new Error('Error al eliminar el producto: ' + error.message);
        }
    }
}