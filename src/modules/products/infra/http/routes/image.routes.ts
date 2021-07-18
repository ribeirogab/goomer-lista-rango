import { Router } from 'express';
import multer from 'multer';

import { uploadConfig } from '@config/upload';

import { ImageController } from '../controllers/ImageController';

const productImageRouter = Router();

const upload = multer(uploadConfig.multer);

const imageController = new ImageController();

productImageRouter.patch(
  '/:restaurantId/:productId',
  upload.single('image'),
  imageController.update,
);

export { productImageRouter };
