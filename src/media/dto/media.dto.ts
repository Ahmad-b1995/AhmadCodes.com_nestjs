import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  file: any;

  @ApiProperty({
    description: 'Folder to upload the file to',
    required: false,
    default: 'general',
  })
  @IsOptional()
  @IsString()
  folder?: string;
}

export class UploadMultipleFilesDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Files to upload',
  })
  files: any[];

  @ApiProperty({
    description: 'Folder to upload the files to',
    required: false,
    default: 'general',
  })
  @IsOptional()
  @IsString()
  folder?: string;
}

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file to upload',
  })
  image: any;

  @ApiProperty({
    description: 'Folder to upload the image to',
    required: false,
    default: 'images',
  })
  @IsOptional()
  @IsString()
  folder?: string;
}

export class UploadDocumentDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Document file to upload',
  })
  document: any;

  @ApiProperty({
    description: 'Folder to upload the document to',
    required: false,
    default: 'documents',
  })
  @IsOptional()
  @IsString()
  folder?: string;
}

export class GetSignedUrlDto {
  @ApiProperty({ description: 'File key' })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'URL expiration time in seconds',
    required: false,
    default: 3600,
  })
  @IsOptional()
  @IsNumber()
  expiresIn?: number;
}

export class GetPresignedUploadUrlDto {
  @ApiProperty({ description: 'File key for upload' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Content type of the file' })
  @IsString()
  contentType: string;

  @ApiProperty({
    description: 'URL expiration time in seconds',
    required: false,
    default: 3600,
  })
  @IsOptional()
  @IsNumber()
  expiresIn?: number;
}

export class FileUploadResponseDto {
  @ApiProperty({ description: 'File key in storage' })
  key: string;

  @ApiProperty({ description: 'File URL' })
  url: string;

  @ApiProperty({ description: 'Original filename' })
  originalName: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiProperty({ description: 'File MIME type' })
  mimeType: string;
}

export class MultipleFileUploadResponseDto {
  @ApiProperty({
    type: [FileUploadResponseDto],
    description: 'Array of uploaded file information',
  })
  files: FileUploadResponseDto[];
}

export class SignedUrlResponseDto {
  @ApiProperty({ description: 'Signed URL for file access' })
  signedUrl: string;
}

export class PresignedUploadUrlResponseDto {
  @ApiProperty({ description: 'Presigned URL for file upload' })
  presignedUrl: string;
}

export class DeleteFileResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string;
}
