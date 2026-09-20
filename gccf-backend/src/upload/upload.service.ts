import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private isConfigured = false;
  private hasWarned = false;

  constructor(private configService: ConfigService) {}

  /**
   * Lazily configure Cloudinary on first upload request instead of during app boot.
   */
  private ensureConfigured(): boolean {
    if (this.isConfigured) return true;

    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.isConfigured = true;
      this.logger.log('Cloudinary successfully configured.');
      return true;
    }

    if (!this.hasWarned) {
      this.hasWarned = true;
      this.logger.warn(
        'Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) not fully set in .env. Uploads will use base64 fallback until credentials are provided.',
      );
    }
    return false;
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'gccf_uploads',
  ): Promise<{ url: string; public_id: string; format?: string; width?: number; height?: number }> {
    if (!file) {
      throw new BadRequestException('No file provided for upload.');
    }

    if (this.ensureConfigured()) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
          },
          (error, result: UploadApiResponse | undefined) => {
            if (error || !result) {
              this.logger.error('Cloudinary upload error:', error);
              return reject(new BadRequestException(`Cloudinary upload failed: ${error?.message || 'Unknown error'}`));
            }
            resolve({
              url: result.secure_url || result.url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
            });
          },
        );

        uploadStream.end(file.buffer);
      });
    }

    // Graceful fallback for local development until user pastes Cloudinary credentials
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    return {
      url: base64,
      public_id: `local_fallback_${Date.now()}`,
    };
  }
}
