import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImageFromBuffer(fileBuffer: Buffer, folder: string = 'products') {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              console.error('Error subiendo a Cloudinary:', error);
              reject(error);
            } else {
              console.log('Imagen subida exitosamente:', result);
              resolve(result);
            }
          }
        ).end(fileBuffer);
      });
    } catch (error) {
      throw new Error(`Error al subir imagen: ${error.message}`);
    }
  }

  // Método alternativo si usas file en lugar de buffer
  async uploadImage(file: Express.Multer.File, folder: string = 'products') {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              console.error('❌ Error subiendo a Cloudinary:', error);
              reject(error);
            } else {
              console.log('✅ Imagen subida exitosamente:', result);
              resolve(result);
            }
          }
        ).end(file.buffer);
      });
    } catch (error) {
      throw new Error(`Error al subir imagen: ${error.message}`);
    }
  }

  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }
}
