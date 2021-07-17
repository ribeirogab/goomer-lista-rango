import { IRestaurant } from '../models/IRestaurant';
import { IFindAllRestaurantsDTO } from './dtos/IFindAllRestaurantsDTO';

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
    { name }: { name?: string },
  ): Promise<IRestaurant>;

  deleteById(restaurantId: string): Promise<void>;
}
