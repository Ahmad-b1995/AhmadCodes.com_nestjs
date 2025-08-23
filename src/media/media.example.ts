/**
 * Example usage of MediaService in other parts of your application
 */

import { Injectable } from '@nestjs/common';
import { MediaService } from './media.service';

@Injectable()
export class ExampleService {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Example: Upload a user's profile picture
   */
  async uploadProfilePicture(file: Express.Multer.File, userId: string) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!this.mediaService.validateFileType(file, allowedTypes)) {
      throw new Error(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (!this.mediaService.validateFileSize(file, maxSize)) {
      throw new Error('File size too large. Maximum 5MB allowed.');
    }

    // Upload to 'profiles' folder
    const result = await this.mediaService.uploadFile(file, 'profiles');

    // You can now save the result.key and result.url to your database
    // associated with the user

    return result;
  }

  /**
   * Example: Upload article images
   */
  async uploadArticleImages(files: Express.Multer.File[], articleId: string) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    // Validate all files
    for (const file of files) {
      if (!this.mediaService.validateFileType(file, allowedTypes)) {
        throw new Error(`Invalid file type for ${file.originalname}`);
      }

      if (!this.mediaService.validateFileSize(file, 10 * 1024 * 1024)) {
        throw new Error(`File ${file.originalname} is too large`);
      }
    }

    // Upload all files to 'articles' folder
    const results = await this.mediaService.uploadMultipleFiles(
      files,
      'articles',
    );

    return results;
  }

  /**
   * Example: Get a secure URL for a private file
   */
  async getSecureFileUrl(fileKey: string, expiresIn: number = 3600) {
    return this.mediaService.getSignedUrl(fileKey, expiresIn);
  }

  /**
   * Example: Delete old files
   */
  async deleteOldFiles(fileKeys: string[]) {
    const deletePromises = fileKeys.map((key) =>
      this.mediaService.deleteFile(key),
    );
    await Promise.all(deletePromises);
  }

  /**
   * Example: Generate presigned URL for direct upload from frontend
   */
  async generateUploadUrl(fileName: string, contentType: string) {
    const key = `temp/${Date.now()}-${fileName}`;
    return this.mediaService.getPresignedUploadUrl(key, contentType);
  }
}
