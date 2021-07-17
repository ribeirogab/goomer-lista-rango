import { IRestaurantAddress } from '../models/IRestaurantAddress';
import { ICreateManyRestaurantAddressesDTO } from './dtos/ICreateManyRestaurantAddressesDTO';
import { IUpdateRestaurantAddressesByRestaurantIdDTO } from './dtos/IUpdateRestaurantAddressesByRestaurantIdDTO';

export interface IRestaurantAddressesRepository {
  createMany({
    restaurantId,
    addresses,
  }: ICreateManyRestaurantAddressesDTO): Promise<IRestaurantAddress[]>;

  findByRestaurantId(restaurantId: string): Promise<IRestaurantAddress[]>;

  updateByRestaurantId({
    restaurantId,
    addresses,
  }: IUpdateRestaurantAddressesByRestaurantIdDTO): Promise<
    IRestaurantAddress[]
  >;
}
