import { IRestaurantAddress } from '../models/IRestaurantAddress';
import { ICreateManyRestaurantAddressesDTO } from './dtos/ICreateManyRestaurantAddressesDTO';

export interface IRestaurantAddressesRepository {
  createMany({
    restaurantId,
    addresses,
  }: ICreateManyRestaurantAddressesDTO): Promise<IRestaurantAddress[]>;

  findByRestaurantId(restaurantId: string): Promise<IRestaurantAddress[]>;
}
