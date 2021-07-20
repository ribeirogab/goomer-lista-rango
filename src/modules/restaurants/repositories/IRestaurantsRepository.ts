import { IRestaurant } from '../models/IRestaurant';
import { IFindAllRestaurantsDTO } from './dtos/IFindAllRestaurantsDTO';
import { IUpdateRestaurantByIdDTO } from './dtos/IUpdateRestaurantByIdDTO';

export interface IRestaurantsRepository {
  create({
    name,
  }: {
    name: string;
  }): Promise<Omit<IRestaurant, 'addresses' | 'workSchedules'>>;

  findAll({ page, perPage }: IFindAllRestaurantsDTO): Promise<{
    count: number;
    restaurants: IRestaurant[];
  }>;

  findById(restaurantId: string): Promise<IRestaurant | null>;

  updateById(
    restaurantId: string,
    { name, image }: IUpdateRestaurantByIdDTO,
  ): Promise<IRestaurant | null>;

  deleteById(restaurantId: string): Promise<void>;
}
