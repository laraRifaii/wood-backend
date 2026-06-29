import { Injectable } from '@nestjs/common';
import { uploadFile } from '@uploadcare/upload-client';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    console.log('Uploading to Uploadcare, public key:', process.env.UPLOADCARE_PUBLIC_KEY?.slice(0, 8) + '...');
    console.log('File:', file.originalname, file.size, 'bytes');
    
    const result = await uploadFile(file.buffer, {
      publicKey: process.env.UPLOADCARE_PUBLIC_KEY!,
      fileName: file.originalname,
      contentType: file.mimetype,
    });

    console.log('Uploadcare result:', result);
    console.log('UUID:', result.uuid);
    console.log('CDN URL:', `https://ucarecdn.com/${result.uuid}/`);

    return `https://ucarecdn.com/${result.uuid}/`;
  }
}