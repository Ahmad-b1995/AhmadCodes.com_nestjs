import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MediaService } from './media.service';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
          new FileTypeValidator({
            fileType:
              /^(image\/(jpeg|jpg|png|gif|webp)|video\/(mp4|avi|mov|wmv)|application\/(pdf|doc|docx|xls|xlsx|ppt|pptx)|text\/(plain|csv))$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.mediaService.uploadFile(file, folder);
  }

  @Post('upload-multiple')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  async uploadMultipleFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB per file
          new FileTypeValidator({
            fileType:
              /^(image\/(jpeg|jpg|png|gif|webp)|video\/(mp4|avi|mov|wmv)|application\/(pdf|doc|docx|xls|xlsx|ppt|pptx)|text\/(plain|csv))$/,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    return this.mediaService.uploadMultipleFiles(files, folder);
  }

  @Post('upload-image')
  @ApiOperation({ summary: 'Upload an image file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /^image\/(jpeg|jpg|png|gif|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('folder') folder: string = 'images',
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    return this.mediaService.uploadFile(file, folder);
  }

  @Post('upload-document')
  @ApiOperation({ summary: 'Upload a document file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }), // 20MB
          new FileTypeValidator({
            fileType:
              /^application\/(pdf|doc|docx|xls|xlsx|ppt|pptx)|text\/(plain|csv)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('folder') folder: string = 'documents',
  ) {
    if (!file) {
      throw new BadRequestException('No document file provided');
    }

    return this.mediaService.uploadFile(file, folder);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({ name: 'key', description: 'File key to delete' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async deleteFile(@Param('key') key: string) {
    // Decode the key in case it's URL encoded
    const decodedKey = decodeURIComponent(key);
    await this.mediaService.deleteFile(decodedKey);
    return { message: 'File deleted successfully' };
  }

  @Get('signed-url/:key')
  @ApiOperation({ summary: 'Get a signed URL for file access' })
  @ApiParam({ name: 'key', description: 'File key' })
  @ApiQuery({
    name: 'expiresIn',
    description: 'URL expiration time in seconds',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Signed URL generated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getSignedUrl(
    @Param('key') key: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    const decodedKey = decodeURIComponent(key);
    const expiration = expiresIn ? parseInt(expiresIn) : 3600;

    const signedUrl = await this.mediaService.getSignedUrl(
      decodedKey,
      expiration,
    );
    return { signedUrl };
  }

  @Get('presigned-upload-url')
  @ApiOperation({ summary: 'Get a presigned URL for direct file upload' })
  @ApiQuery({ name: 'key', description: 'File key for upload' })
  @ApiQuery({ name: 'contentType', description: 'Content type of the file' })
  @ApiQuery({
    name: 'expiresIn',
    description: 'URL expiration time in seconds',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Presigned upload URL generated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getPresignedUploadUrl(
    @Query('key') key: string,
    @Query('contentType') contentType: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    if (!key || !contentType) {
      throw new BadRequestException('Key and contentType are required');
    }

    const expiration = expiresIn ? parseInt(expiresIn) : 3600;

    const presignedUrl = await this.mediaService.getPresignedUploadUrl(
      key,
      contentType,
      expiration,
    );
    return { presignedUrl };
  }
}
