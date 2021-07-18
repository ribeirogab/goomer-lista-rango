import { v4 as uuid } from 'uuid';

import { ICategory } from '@modules/products/models/ICategory';

import { ICreateCategoryDTO } from '../dtos/ICreateCategoryDTO';
import { IFindCategoryByIdDTO } from '../dtos/IFindCategoryByIdDTO';
import { IFindCategoryByNameDTO } from '../dtos/IFindCategoryByNameDTO';
import { ICategoriesRepository } from '../ICategoriesRepository';

type CategoryEntity = {
  id: string;
  restaurantId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export class FakeCategoriesRepository implements ICategoriesRepository {
  private categories: CategoryEntity[];

  constructor() {
    this.categories = [];
  }

  public async create({
    restaurantId,
    name,
  }: ICreateCategoryDTO): Promise<ICategory> {
    const category: CategoryEntity = {
      id: uuid(),
      restaurantId,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.categories.push(category);

    const formattedCategory: ICategory = {
      id: category.id,
      name: category.name,
    };

    return formattedCategory;
  }

  public async findByName({
    restaurantId,
    categoryName,
  }: IFindCategoryByNameDTO): Promise<ICategory | null> {
    const foundCategory = this.categories.find(
      category =>
        category.name === categoryName &&
        category.restaurantId === restaurantId,
    );

    if (!foundCategory) {
      return null;
    }

    const formattedCategory: ICategory = {
      id: foundCategory.id,
      name: foundCategory.name,
    };

    return formattedCategory;
  }

  public async findById({
    restaurantId,
    categoryId,
  }: IFindCategoryByIdDTO): Promise<ICategory | null> {
    const foundCategory = this.categories.find(
      category =>
        category.id === categoryId && category.restaurantId === restaurantId,
    );

    if (!foundCategory) {
      return null;
    }

    const formattedCategory: ICategory = {
      id: foundCategory.id,
      name: foundCategory.name,
    };

    return formattedCategory;
  }
}
