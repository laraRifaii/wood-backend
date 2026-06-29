import { Injectable } from '@nestjs/common';
import { uploadFile } from '@uploadcare/upload-client';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    const result = await uploadFile(file.buffer, {
      publicKey: process.env.UPLOADCARE_PUBLIC_KEY!,
      fileName: file.originalname,
      contentType: file.mimetype,
    });

    return `https://ucarecdn.com/${result.uuid}/`;
  }
}