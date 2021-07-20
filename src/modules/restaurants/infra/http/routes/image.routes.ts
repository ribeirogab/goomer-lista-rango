import { Router } from 'express';
import multer from 'multer';

import { uploadConfig } from '@config/upload';

import { ImageController } from '../controllers/ImageController';

const restaurantImageRouter = Router();

const upload = multer(uploadConfig.multer);

const imageController = new ImageController();

restaurantImageRouter.patch(
  '/:restaurantId',
  upload.single('image'),
  imageController.update,
);

export { restaurantImageRouter };
