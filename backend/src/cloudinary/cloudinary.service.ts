import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    this.initializeCloudinary();
  }

  private initializeCloudinary(): void {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    console.log('🔧 Cloudinary Configuration Check:', {
      cloudName: cloudName ? `✅ Set (${cloudName})` : '❌ Missing',
      apiKey: apiKey ? `✅ Set (${apiKey.substring(0, 6)}...)` : '❌ Missing',
      apiSecret: apiSecret ? `✅ Set (${apiSecret.substring(0, 6)}...)` : '❌ Missing',
    });

    if (cloudName && apiKey && apiSecret) {
      try {
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
          secure: true,
        });
        this.isConfigured = true;
        console.log('✅ Cloudinary configured successfully');
      } catch (error) {
        console.error('❌ Cloudinary configuration failed:', error);
        this.isConfigured = false;
      }
    } else {
      console.warn('⚠️ Cloudinary credentials not configured. Using fallback images.');
      this.isConfigured = false;
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    console.log('📤 CloudinaryService: Starting upload process', {
      filename: file.originalname,
      mimetype: file.mimetype,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      hasBuffer: !!file.buffer,
      bufferLength: file.buffer?.length,
    });

    // If Cloudinary is not configured, return a high-quality fallback image
    if (!this.isConfigured) {
      console.warn('⚠️ Cloudinary not configured, using fallback image');
      return 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop';
    }

    // Validate file
    if (!file || !file.buffer) {
      console.error('❌ No file buffer received for upload');
      throw new Error('No file buffer received for upload');
    }

    // Validate file type
    if (!file.mimetype.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
      console.error('❌ Invalid file type:', file.mimetype);
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.error('❌ File too large:', file.size);
      throw new Error('File size must be less than 10MB');
    }

    try {
      console.log('🚀 Starting Cloudinary upload...');
      
      return new Promise((resolve, reject) => {
        const uploadOptions = {
          folder: 'ecommerce-products',
          resource_type: 'image' as const,
          transformation: [
            { 
              width: 800, 
              height: 600, 
              crop: 'fill', 
              quality: 'auto:good',
              fetch_format: 'auto'
            },
          ],
          format: 'jpg', // Convert all images to JPG for consistency
          public_id: `product_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        };

        console.log('📋 Upload options:', uploadOptions);

        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary upload error:', {
                message: error.message,
                http_code: error.http_code,
                error: error
              });
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
              bytes: result.bytes,
              created_at: result.created_at
            });

            // Verify the URL is accessible
            console.log('🔗 Final image URL:', result.secure_url);
            resolve(result.secure_url);
          },
        );

        // Create readable stream from buffer and pipe to upload stream
        try {
          console.log('📡 Creating stream from buffer...');
          const bufferStream = new Readable();
          bufferStream.push(file.buffer);
          bufferStream.push(null); // Signal end of stream
          
          console.log('📤 Piping buffer to Cloudinary...');
          bufferStream.pipe(uploadStream);
        } catch (streamError) {
          console.error('❌ Stream creation error:', streamError);
          reject(new Error(`Stream creation failed: ${streamError.message}`));
        }
      });
    } catch (error: any) {
      console.error('❌ Cloudinary service error:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  // Test method to verify Cloudinary connection
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }

    try {
      const result = await cloudinary.api.ping();
      console.log('✅ Cloudinary connection test successful:', result);
      return true;
    } catch (error) {
      console.error('❌ Cloudinary connection test failed:', error);
      return false;
    }
  }
}