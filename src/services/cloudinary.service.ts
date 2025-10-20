import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';

export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    uploadImage(buffer: Buffer, folder: 'products'){
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder },
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            streamifier.createReadStream(buffer).pipe(stream);
        });
    }
    deleteImage(publicId: string){
        return cloudinary.uploader.destroy(publicId);
    }
}
