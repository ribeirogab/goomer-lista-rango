import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { IRestaurant } from '../models/IRestaurant';
import { IRestaurantsRepository } from '../repositories/IRestaurantsRepository';

interface IRequest {
  restaurantId: string;
}

@injectable()
export class ListOneRestaurantService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,
  ) {}

  public async execute({ restaurantId }: IRequest): Promise<IRestaurant> {
    const restaurant = await this.restaurantsRepository.findById(restaurantId);

    if (!restaurant) {
      throw new AppError('Restaurant not found.', 404, 'restaurant.notfound');
    }

    return restaurant;
  }
}
