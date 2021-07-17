import { IProduct } from '../models/IProduct';
import { ICreateProductDTO } from './dtos/ICreateProductDTO';
import { IFindProductsByRestaurantIdDTO } from './dtos/IFindProductsByRestaurantIdDTO';
import { IUpdateProductDTO } from './dtos/IUpdateProductDTO';

export interface IProductsRepository {
  create({
    restaurantId,
    categoryId,
    name,
    price,
  }: ICreateProductDTO): Promise<Omit<IProduct, 'promotion' | 'category'>>;

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
  }): Promise<IProduct | null>;

  update({
    restaurantId,
    productId,
    categoryId,
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
