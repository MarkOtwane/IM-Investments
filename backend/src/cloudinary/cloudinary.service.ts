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

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'products' },
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

      // Convert buffer to stream
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }
}
