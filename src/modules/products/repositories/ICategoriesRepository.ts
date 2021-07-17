import { ICategory } from '../models/ICategory';
import { ICreateCategoryDTO } from './dtos/ICreateCategoryDTO';
import { IFindCategoryByIdDTO } from './dtos/IFindCategoryByIdDTO';
import { IFindCategoryByNameDTO } from './dtos/IFindCategoryByNameDTO';

export interface ICategoriesRepository {
  create({ restaurantId, name }: ICreateCategoryDTO): Promise<ICategory>;

  findByName({
    restaurantId,
    categoryName,
  }: IFindCategoryByNameDTO): Promise<ICategory | null>;

  findById({
    restaurantId,
    categoryId,
  }: IFindCategoryByIdDTO): Promise<ICategory | null>;
}
