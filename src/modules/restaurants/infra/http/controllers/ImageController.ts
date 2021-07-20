import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateRestaurantImageService } from '@modules/restaurants/services/UpdateRestaurantImageService';

export class ImageController {
  async update(req: Request, res: Response): Promise<Response> {
    const { restaurantId } = req.params;
    const imageFilename = req.file?.filename;

    const updateRestaurantImageService = container.resolve(
      UpdateRestaurantImageService,
    );

    const updatedRestaurant = await updateRestaurantImageService.execute({
      restaurantId,
      imageFilename,
    });

    return res.json({ restaurant: updatedRestaurant });
  }
}
