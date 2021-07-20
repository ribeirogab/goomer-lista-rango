import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

type Driver = 'disk' | 's3';

interface IUploadConfig {
  driver: Driver;

  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;
  };
}

function createSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/(\s+)/g, '-')
    .replace(/--+/g, '-')
    .replace(/(^-+|-+$)/, '');
}

const multerStorage = multer.diskStorage({
  destination: tmpFolder,
  filename(req, file, callback) {
    const fileHash = crypto.randomBytes(10).toString('hex');
    const fileName = `${fileHash}-${createSlug(file.originalname)}`;

    return callback(null, fileName);
  },
});

const driver = process.env.STORAGE_DRIVER as Driver;

const uploadConfig: IUploadConfig = {
  driver,
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  multer: {
    storage: multerStorage,
  },
};

export { uploadConfig };
