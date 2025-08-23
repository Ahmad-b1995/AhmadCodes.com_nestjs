# Media Upload Module

This module provides file upload functionality using DigitalOcean Spaces (S3-compatible storage) for your NestJS application.

## Features

- ✅ Single file upload
- ✅ Multiple file upload
- ✅ Image-specific upload with validation
- ✅ Document-specific upload with validation
- ✅ File deletion
- ✅ Signed URLs for secure file access
- ✅ Presigned URLs for direct client uploads
- ✅ File type and size validation
- ✅ Automatic bucket creation
- ✅ Swagger documentation

## Configuration

Add the following environment variables to your `.env` file:

```env
# DigitalOcean Spaces Configuration
DO_SPACES_KEY=DO801ZDXBJL7K7NZUJX9
DO_SPACES_SECRET=nPLKPzIqY0CYtwN97EU/cUEVRGrRm2feU04s56ROq80
DO_SPACES_BUCKET=woody
DO_SPACES_REGION=tor1
```

## API Endpoints

### Upload Files

#### Single File Upload
```
POST /media/upload
Content-Type: multipart/form-data

Body:
- file: File to upload
- folder: (optional) Folder name (default: 'general')
```

#### Multiple Files Upload
```
POST /media/upload-multiple
Content-Type: multipart/form-data

Body:
- files: Array of files to upload (max 10)
- folder: (optional) Folder name (default: 'general')
```

#### Image Upload
```
POST /media/upload-image
Content-Type: multipart/form-data

Body:
- image: Image file (JPEG, PNG, GIF, WebP)
- folder: (optional) Folder name (default: 'images')

Limits:
- Max size: 10MB
- Types: image/jpeg, image/png, image/gif, image/webp
```

#### Document Upload
```
POST /media/upload-document
Content-Type: multipart/form-data

Body:
- document: Document file
- folder: (optional) Folder name (default: 'documents')

Limits:
- Max size: 20MB
- Types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV
```

### File Management

#### Delete File
```
DELETE /media/:key
```

#### Get Signed URL
```
GET /media/signed-url/:key?expiresIn=3600
```

#### Get Presigned Upload URL
```
GET /media/presigned-upload-url?key=file-key&contentType=image/jpeg&expiresIn=3600
```

## Usage in Your Code

### Inject MediaService

```typescript
import { Injectable } from '@nestjs/common';
import { MediaService } from './media/media.service';

@Injectable()
export class YourService {
  constructor(private readonly mediaService: MediaService) {}

  async uploadUserAvatar(file: Express.Multer.File, userId: string) {
    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!this.mediaService.validateFileType(file, allowedTypes)) {
      throw new Error('Invalid file type');
    }

    // Upload file
    const result = await this.mediaService.uploadFile(file, 'avatars');
    
    // Save result.key and result.url to your database
    return result;
  }
}
```

### File Upload Response

```typescript
{
  key: string;           // File key in storage
  url: string;           // Direct access URL
  originalName: string;  // Original filename
  size: number;          // File size in bytes
  mimeType: string;      // File MIME type
}
```

## File Organization

Files are organized in folders within the bucket:
- `general/` - Default folder for general uploads
- `images/` - Image files
- `documents/` - Document files
- `profiles/` - User profile pictures
- `articles/` - Article-related media
- Custom folders as specified

## File Validation

### Supported File Types

**Images:**
- JPEG/JPG
- PNG
- GIF
- WebP

**Documents:**
- PDF
- DOC/DOCX
- XLS/XLSX
- PPT/PPTX
- TXT
- CSV

**Videos:**
- MP4
- AVI
- MOV
- WMV

### Size Limits

- General files: 50MB
- Images: 10MB
- Documents: 20MB
- Multiple files: 10 files max

## Security

- Files are stored with UUID-based names to prevent conflicts
- Signed URLs provide temporary access to files
- File type validation prevents malicious uploads
- Size limits prevent abuse

## Error Handling

The service throws `BadRequestException` for:
- Invalid file types
- Files too large
- Missing files
- Upload failures
- Invalid parameters

## Testing

You can test the endpoints using the Swagger UI available at `/api/docs` when running in development mode.

## Example Frontend Usage

### Upload with Fetch API

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('folder', 'profiles');

const response = await fetch('/media/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Uploaded:', result);
```

### Direct Upload with Presigned URL

```javascript
// Get presigned URL
const presignedResponse = await fetch(
  `/media/presigned-upload-url?key=profiles/avatar.jpg&contentType=image/jpeg`
);
const { presignedUrl } = await presignedResponse.json();

// Upload directly to MinIO
await fetch(presignedUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': 'image/jpeg'
  }
});
``` 