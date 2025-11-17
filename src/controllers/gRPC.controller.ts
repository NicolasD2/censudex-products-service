import {Controller, UseGuards} from '@nestjs/common';
import {GrpcMethod} from '@nestjs/microservices';
import { create } from 'domain';
import { off } from 'process';
import { ProductsService } from 'src/services/products.service';

interface GetProductsRequest {
    category?: string;
    isActive?: boolean;
    limit: number;
    offset: number;
}

interface GetProductRequest {
    id: string;
}

interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    category: string;
    isActive: boolean;
    imageBuffer?: Buffer;
}

interface UpdateProductRequest {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    isActive?: boolean;
    imageBuffer?: Buffer;
}

interface DeleteProductRequest {
    id: string;
}

@Controller()
export class ProductsGrpcController {
  constructor(private readonly productsService: ProductsService) {}

  @GrpcMethod('ProductsService', 'GetProducts')
  async getProducts(data: GetProductsRequest) {
    try {
      const filters: any = {};
      
      if (data.category) filters.category = data.category;
      if (data.isActive !== undefined) filters.isActive = data.isActive;

      const products = await this.productsService.findAll(filters);
      
      return {
        products: products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl || '',
          isActive: product.isActive,
          createdAt: product.createdAt ? product.createdAt.toISOString() : '',
          updatedAt: product.updatedAt ? product.updatedAt.toISOString() : '',
        })),
        total: products.length
      };
    } catch (error) {
      throw new Error(`gRPC Error: ${error.message}`);
    }
  }

  @GrpcMethod('ProductsService', 'GetProduct')
  async getProduct(data: GetProductRequest) {
    try {
      const product = await this.productsService.findById(data.id);
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        isActive: product.isActive,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };
    } catch (error) {
      throw new Error(`gRPC Error: ${error.message}`);
    }
  }

  @GrpcMethod('ProductsService', 'CreateProduct')
  async createProduct(data: CreateProductRequest) {
    try {
      const product = await this.productsService.create(data, data.imageBuffer as Buffer);
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: data.category,
        imageUrl: product.imageUrl || '',
        isActive: product.isActive,
        createdAt: product.createdAt ? product.createdAt.toISOString() : '',
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : '',
      };
    } catch (error) {
      throw new Error(`gRPC Error: ${error.message}`);
    }
  }

  @GrpcMethod('ProductsService', 'UpdateProduct')
  async updateProduct(data: UpdateProductRequest) {
    try {
      const { id, ...updateData } = data;
      
      const product = await this.productsService.update(
        id, 
        updateData, 
        data.imageBuffer as Buffer
      );
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        isActive: product.isActive,
        createdAt: product.createdAt ? product.createdAt.toISOString() : '',
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : '',
      };
    } catch (error) {
      throw new Error(`gRPC Error: ${error.message}`);
    }
  }

  @GrpcMethod('ProductsService', 'DeleteProduct')
  async deleteProduct(data: DeleteProductRequest) {
    try {
      await this.productsService.softDelete(data.id);
      
      return {
        success: true,
        message: 'Producto eliminado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    }
  }
}