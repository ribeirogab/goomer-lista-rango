import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import { IRestaurant } from '../models/IRestaurant';
import { IRestaurantsRepository } from '../repositories/IRestaurantsRepository';

interface IRequest {
  restaurantId: string;
  imageFilename?: string;
}

@injectable()
export class UpdateRestaurantImage {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute({
    restaurantId,
    imageFilename,
  }: IRequest): Promise<IRestaurant> {
    if (!imageFilename) {
      throw new AppError('Invalide file.', 400);
    }

    const restaurant = await this.restaurantsRepository.findById(restaurantId);

    if (!restaurant) {
      throw new AppError('Restaurant not found.', 404);
    }

    if (restaurant.image) {
      await this.storageProvider.deleteFile(restaurant.image);
    }

    const filename = await this.storageProvider.saveFile(imageFilename);

    const updatedRestaurant = (await this.restaurantsRepository.updateById(
      restaurant.id,
      { image: filename },
    )) as IRestaurant;

    await this.cacheProvider.invalidatePrefix('restaurant-list');
    await this.cacheProvider.invalidate(`restaurant:${restaurantId}`);

    return updatedRestaurant;
  }
}
