import { inject, injectable } from 'tsyringe';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { IRestaurantsRepository } from '../repositories/IRestaurantsRepository';

interface IRequest {
  restaurantId: string;
}

@injectable()
export class DeleteRestaurantService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ restaurantId }: IRequest): Promise<void> {
    await this.restaurantsRepository.deleteById(restaurantId);

    await this.cacheProvider.invalidatePrefix('restaurant-list');
    await this.cacheProvider.invalidatePrefix(
      '',
      `product-list:${restaurantId}*`,
    );
    await this.cacheProvider.invalidatePrefix('', `product:${restaurantId}*`);
  }
}
