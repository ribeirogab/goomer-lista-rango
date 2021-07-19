import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateProductImageService } from '@modules/products/services/UpdateProductImageService';

export class ImageController {
  async update(req: Request, res: Response): Promise<Response> {
    const { restaurantId, productId } = req.params;
    const imageFilename = req.file?.filename;

    const updateProductImageService = container.resolve(
      UpdateProductImageService,
    );

    const updatedProduct = await updateProductImageService.execute({
      restaurantId,
      productId,
      imageFilename,
    });

    return res.json({ product: updatedProduct });
  }
}
