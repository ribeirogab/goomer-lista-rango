import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateRestaurantService } from '@modules/restaurants/services/CreateRestaurantService';
import { DeleteRestaurantService } from '@modules/restaurants/services/DeleteRestaurantService';
import { ListAllRestaurantsService } from '@modules/restaurants/services/ListAllRestaurantsService';
import { ListOneRestaurantService } from '@modules/restaurants/services/ListOneRestaurantService';
import { UpdateRestaurantService } from '@modules/restaurants/services/UpdateRestaurantService';

export class RestaurantsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, addresses, workSchedules } = req.body;

    const createRestaurantService = container.resolve(CreateRestaurantService);

    const restaurant = await createRestaurantService.execute({
      name,
      addresses,
      workSchedules,
    });

    return res.json({
      restaurant,
    });
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { page, perPage } = req.query;

    const listAllRestaurantsService = container.resolve(
      ListAllRestaurantsService,
    );

    const { pageInfo, restaurants } = await listAllRestaurantsService.execute({
      page: page as number | undefined,
      perPage: perPage as number | undefined,
    });

    return res.json({ pageInfo, restaurants });
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { restaurantId } = req.params;

    const listOneRestaurantService = container.resolve(
      ListOneRestaurantService,
    );

    const restaurant = await listOneRestaurantService.execute({ restaurantId });

    return res.json({
      restaurant,
    });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { restaurantId } = req.params;
    const { name, addresses, workSchedules } = req.body;

    const updateRestaurantService = container.resolve(UpdateRestaurantService);

    const restaurant = await updateRestaurantService.execute({
      restaurantId,
      name,
      addresses,
      workSchedules,
    });

    return res.json({ restaurant });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { restaurantId } = req.params;

    const deleteRestaurantService = container.resolve(DeleteRestaurantService);

    await deleteRestaurantService.execute({ restaurantId });

    return res.status(204).send();
  }
}
