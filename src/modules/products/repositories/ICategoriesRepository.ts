import { ICategory } from '../models/ICategory';
import { ICreateCategoryDTO } from './dtos/ICreateCategoryDTO';

export interface ICategoriesRepository {
  create({ restaurantId, name }: ICreateCategoryDTO): Promise<ICategory>;

  findByName(categoryName: string): Promise<ICategory | null>;

  findById(categoryId: string): Promise<ICategory | null>;
}
