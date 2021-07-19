import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ restaurantId }: IRequest): Promise<IRestaurant> {
    const cacheKey = this.cacheProvider.createKey({
      prefix: 'restaurant',
      params: [restaurantId],
    });

    const cacheData = await this.cacheProvider.recover<IRestaurant>(cacheKey);

    if (cacheData) {
      return cacheData;
    }

    const restaurant = await this.restaurantsRepository.findById(restaurantId);

    if (!restaurant) {
      throw new AppError('Restaurant not found.', 404);
    }

    await this.cacheProvider.save(cacheKey, restaurant);

    return restaurant;
  }
}
