import { S3 } from 'aws-sdk';
import fs from 'fs';
import mime from 'mime';
import path from 'path';

import { uploadConfig } from '@config/upload';

import { IStorageProvider } from '../models/IStorageProvider';

export class AmazonS3Provider implements IStorageProvider {
  private s3Client: S3;

  constructor() {
    this.s3Client = new S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found.');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.s3Client
      .putObject({
        Bucket: 'goomer-lista-rango',
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.s3Client
      .deleteObject({
        Bucket: 'goomer-lista-rango',
        Key: file,
      })
      .promise();
  }
}
