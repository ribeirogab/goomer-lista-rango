import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateRestaurantImage } from '@modules/restaurants/services/UpdateRestaurantImage';

export class ImageController {
  async update(req: Request, res: Response): Promise<Response> {
    const { restaurantId } = req.params;
    const imageFilename = req.file?.filename;

    const updateRestaurantImage = container.resolve(UpdateRestaurantImage);

    const updatedRestaurant = await updateRestaurantImage.execute({
      restaurantId,
      imageFilename,
    });

    return res.json({ restaurant: updatedRestaurant });
  }
}
