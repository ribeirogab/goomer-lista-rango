import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'disk';

  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;
  };
}

const multerStorage = multer.diskStorage({
  destination: tmpFolder,
  filename(req, file, callback) {
    const fileHash = crypto.randomBytes(10).toString('hex');
    const fileName = `${fileHash}-${file.originalname}`;

    return callback(null, fileName);
  },
});

const uploadConfig: IUploadConfig = {
  driver: 'disk',
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  multer: {
    storage: multerStorage,
  },
};

export { uploadConfig };