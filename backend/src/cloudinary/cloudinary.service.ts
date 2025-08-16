import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    } else {
      console.warn(
        'Cloudinary credentials not configured. Image uploads will use default images.',
      );
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');

    if (!cloudName) {
      console.warn('Cloudinary not configured, using default image');
      return 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
    }

    // Prefer in-memory buffer uploads (recommended when using Multer memoryStorage)
    if (file && (file as any).buffer) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'products', resource_type: 'image' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              return reject(new Error(error.message || 'Upload failed'));
            }
            if (!result) {
              return reject(new Error('Upload failed'));
            }
            resolve(result.secure_url);
          },
        );

        const bufferStream = new Readable();
        bufferStream.push((file as any).buffer);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
      });
    }

    // Fallback: if running with disk storage, use the temporary file path
    if (file && (file as any).path) {
      try {
        const result = await cloudinary.uploader.upload((file as any).path, {
          folder: 'products',
          resource_type: 'image',
        });
        return result.secure_url;
      } catch (error: any) {
        console.error('Cloudinary path upload error:', error);
        throw new Error(error.message || 'Upload failed');
      }
    }

    throw new Error('No image file content received');
  }
}
