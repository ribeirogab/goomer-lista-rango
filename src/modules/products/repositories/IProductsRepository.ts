import { IProduct } from '../models/IProduct';
import { ICreateProductDTO } from './dtos/ICreateProductDTO';
import { IFindProductsByRestaurantIdDTO } from './dtos/IFindProductsByRestaurantIdDTO';
import { IUpdateProductDTO } from './dtos/IUpdateProductDTO';

export interface IProductsRepository {
  create({
    restaurantId,
    categoryId,
    promotionId,
    name,
    price,
  }: ICreateProductDTO): Promise<IProduct>;

  findAll({
    restaurantId,
    page,
    perPage,
  }: IFindProductsByRestaurantIdDTO): Promise<IProduct[]>;

  findOne({
    restaurantId,
    productId,
  }: {
    restaurantId: string;
    productId: string;
  }): Promise<IProduct>;

  update({
    restaurantId,
    promotionId,
    name,
    price,
  }: IUpdateProductDTO): Promise<IProduct>;

  delete({
    restaurantId,
    productId,
  }: {
    restaurantId: string;
    productId: string;
  }): Promise<void>;
}
