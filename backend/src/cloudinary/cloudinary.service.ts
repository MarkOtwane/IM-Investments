import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    console.log('Cloudinary Config Check:', {
      cloudName: cloudName ? 'Set' : 'Missing',
      apiKey: apiKey ? 'Set' : 'Missing',
      apiSecret: apiSecret ? 'Set' : 'Missing',
    });

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.isConfigured = true;
      console.log('✅ Cloudinary configured successfully');
    } else {
      console.warn('⚠️ Cloudinary credentials not configured. Using fallback images.');
      this.isConfigured = false;
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    console.log('CloudinaryService: Upload attempt', {
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      hasBuffer: !!file.buffer,
      bufferLength: file.buffer?.length,
    });

    if (!this.isConfigured) {
      console.warn('Cloudinary not configured, using fallback image');
      return 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
    }

    if (!file || !file.buffer) {
      throw new Error('No file buffer received for upload');
    }

    try {
      return new Promise((resolve, reject) => {
        const uploadOptions = {
          folder: 'ecommerce-products',
          resource_type: 'image' as const,
          transformation: [
            { width: 800, height: 600, crop: 'fill', quality: 'auto' },
          ],
          format: 'jpg', // Convert all images to JPG for consistency
        };

        console.log('Starting Cloudinary upload with options:', uploadOptions);

        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary upload error:', error);
              return reject(new Error(`Cloudinary upload failed: ${error.message}`));
            }

            if (!result) {
              console.error('❌ Cloudinary upload failed: No result returned');
              return reject(new Error('Cloudinary upload failed: No result'));
            }

            console.log('✅ Cloudinary upload successful:', {
              public_id: result.public_id,
              secure_url: result.secure_url,
              format: result.format,
              width: result.width,
              height: result.height,
            });

            resolve(result.secure_url);
          },
        );

        // Create readable stream from buffer
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
      });
    } catch (error: any) {
      console.error('❌ Cloudinary service error:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }
}