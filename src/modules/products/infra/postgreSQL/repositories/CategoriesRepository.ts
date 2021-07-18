import { connection } from '@shared/infra/databases/postgreSQL/connection';

import { ICategory } from '@modules/products/models/ICategory';
import { ICreateCategoryDTO } from '@modules/products/repositories/dtos/ICreateCategoryDTO';
import { IFindCategoryByIdDTO } from '@modules/products/repositories/dtos/IFindCategoryByIdDTO';
import { IFindCategoryByNameDTO } from '@modules/products/repositories/dtos/IFindCategoryByNameDTO';
import { ICategoriesRepository } from '@modules/products/repositories/ICategoriesRepository';

import { CategoryEntity } from '../entities/CategoryEntity';

export class CategoriesRepository implements ICategoriesRepository {
  private entity: typeof CategoryEntity;

  constructor() {
    this.entity = CategoryEntity;
  }

  public async create({
    restaurantId,
    name,
  }: ICreateCategoryDTO): Promise<ICategory> {
    const { pool } = connection('CategoriesRepository.create');

    const { rows } = await pool.query<CategoryEntity>(
      `INSERT INTO ${this.entity.table}
      (id, restaurant_id, name)
      VALUES (DEFAULT, $1, $2)
      RETURNING *`,
      [restaurantId, name.trim()],
    );

    const category = this.entity.formatCategory(rows[0]);

    return category;
  }

  public async findByName({
    restaurantId,
    categoryName,
  }: IFindCategoryByNameDTO): Promise<ICategory | null> {
    const { pool } = connection('CategoriesRepository.findByName');

    const { rows } = await pool.query<CategoryEntity>(
      `SELECT * FROM ${this.entity.table}
      WHERE restaurant_id = $1
      AND UPPER(name) = UPPER($2)`,
      [restaurantId, categoryName],
    );

    if (!rows[0]) {
      return null;
    }

    const category = this.entity.formatCategory(rows[0]);

    return category;
  }

  public async findById({
    restaurantId,
    categoryId,
  }: IFindCategoryByIdDTO): Promise<ICategory | null> {
    const { pool } = connection('CategoriesRepository.findById');

    const { rows } = await pool.query<CategoryEntity>(
      `SELECT * FROM ${this.entity.table}
      WHERE restaurant_id = $1
      AND id = $2`,
      [restaurantId, categoryId],
    );

    if (!rows[0]) {
      return null;
    }

    const category = this.entity.formatCategory(rows[0]);

    return category;
  }
}
