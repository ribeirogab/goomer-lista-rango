import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateProductImage } from '@modules/products/services/UpdateProductImage';

export class ImageController {
  async update(req: Request, res: Response): Promise<Response> {
    const { restaurantId, productId } = req.params;
    const imageFilename = req.file?.filename;

    const updateProductImage = container.resolve(UpdateProductImage);

    const updatedProduct = await updateProductImage.execute({
      restaurantId,
      productId,
      imageFilename,
    });

    return res.json({ product: updatedProduct });
  }
}
