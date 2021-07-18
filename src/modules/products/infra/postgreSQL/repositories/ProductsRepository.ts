import { Pool } from 'pg';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

import { connection } from '@shared/infra/databases/postgreSQL/connection';

import { IProduct } from '@modules/products/models/IProduct';
import { ICreateProductDTO } from '@modules/products/repositories/dtos/ICreateProductDTO';
import { IFindProductsByRestaurantIdDTO } from '@modules/products/repositories/dtos/IFindProductsByRestaurantIdDTO';
import { IUpdateProductDTO } from '@modules/products/repositories/dtos/IUpdateProductDTO';
import { IProductsRepository } from '@modules/products/repositories/IProductsRepository';

import { ProductEntity } from '../entities/ProductEntity';

export class ProductsRepository implements IProductsRepository {
  private entity: typeof ProductEntity;

  constructor() {
    this.entity = ProductEntity;
  }

  private isValidId(id: string) {
    return uuidValidate(id) && uuidVersion(id) === 4;
  }

  public async create({
    restaurantId,
    categoryId,
    name,
    price,
  }: ICreateProductDTO): Promise<Omit<IProduct, 'promotion' | 'category'>> {
    const { pool } = connection('ProductsRepository.create');

    const { rows } = await pool.query<ProductEntity>(
      `INSERT INTO ${this.entity.table}
      (id, restaurant_id, category_id, name, image, price)
      VALUES (DEFAULT, $1, $2, $3, $4, $5)
      RETURNING *, price::float`,
      [restaurantId, categoryId, name, null, price],
    );

    const product = this.entity.formatProduct(rows[0]);

    return product;
  }

  public async findAll({
    restaurantId,
    page,
    perPage,
  }: IFindProductsByRestaurantIdDTO): Promise<{
    count: number;
    products: IProduct[];
  }> {
    const { pool } = connection('ProductsRepository.findAll');

    const { rows } = await pool.query<Omit<IProduct, 'imageUrl'>>(
      `SELECT
        p.id, p.name, p.price::float, p.image,
        (CASE WHEN
          ca.id IS NULL THEN
            null
          ELSE
            jsonb_build_object(
              'id', ca.id,
              'name', ca.name
            )
          END
        ) AS "category",
        (CASE WHEN
          pro.id IS NULL THEN
            null
          ELSE
            jsonb_build_object(
              'id', pro.id,
              'description', pro.description,
              'price', pro.price::float,
              'startDatetime', pro.start_datetime,
              'finishDatetime', pro.finish_datetime
            )
          END
        ) AS "promotion",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt"
      FROM ${this.entity.table} AS p
        LEFT JOIN ${this.entity.relations.categories.table} AS ca
          ON p.category_id = ca.id
        LEFT JOIN ${this.entity.relations.promotions.table} AS pro
          ON p.id = pro.product_id
      WHERE p.restaurant_id = $1
      OFFSET $2 LIMIT $3
      `,
      [restaurantId, (page - 1) * perPage, perPage],
    );

    const productsWithImageUrl: IProduct[] = rows.map(product => ({
      ...product,
      imageUrl: this.entity.setImageUrl(product.image),
    }));

    const { count } = (
      await pool.query<{ count: string }>(
        `SELECT count(*) AS count FROM ${this.entity.table}
        WHERE restaurant_id = $1`,
        [restaurantId],
      )
    ).rows[0];

    return { count: Number(count), products: productsWithImageUrl };
  }

  public async findOne(
    {
      restaurantId,
      productId,
    }: {
      restaurantId: string;
      productId: string;
    },
    sharedPool?: Pool,
  ): Promise<IProduct | null> {
    const pool = sharedPool ?? connection('ProductsRepository.findAll').pool;

    const { rows } = await pool.query<Omit<IProduct, 'imageUrl'>>(
      `SELECT
        p.id, p.name, p.price::float, p.image,
        (CASE WHEN
          ca.id IS NULL THEN
            null
          ELSE
            jsonb_build_object(
              'id', ca.id,
              'name', ca.name
            )
          END
        ) AS "category",
        (CASE WHEN
          pro.id IS NULL THEN
            null
          ELSE
            jsonb_build_object(
              'id', pro.id,
              'description', pro.description,
              'price', pro.price::float,
              'startDatetime', pro.start_datetime,
              'finishDatetime', pro.finish_datetime
            )
          END
        ) AS "promotion",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt"
      FROM ${this.entity.table} AS p
        LEFT JOIN ${this.entity.relations.categories.table} AS ca
          ON p.category_id = ca.id
        LEFT JOIN ${this.entity.relations.promotions.table} AS pro
          ON p.id = pro.product_id
      WHERE p.restaurant_id = $1
        AND p.id = $2
      `,
      [restaurantId, productId],
    );

    if (!rows[0]?.id) {
      return null;
    }

    const product: IProduct = {
      ...rows[0],
      imageUrl: this.entity.setImageUrl(rows[0].image),
    };

    return product;
  }

  public async update({
    restaurantId,
    productId,
    categoryId,
    name,
    image,
    price,
  }: IUpdateProductDTO): Promise<IProduct | null> {
    const { pool } = connection('ProductsRepository.update');

    const possibleValuesToBeUpdated = [
      { category_id: categoryId },
      { name },
      { image },
      { price },
    ];

    const values: (string | number)[] = [];
    let query = '';

    possibleValuesToBeUpdated.forEach(objectValue => {
      const value = Object.values(objectValue)[0];

      if (value) {
        const key = Object.keys(objectValue)[0];

        query += `${values.length > 0 ? ', ' : 'SET '}${key} = $${
          values.length + 3
        }`;
        values.push(value);
      }
    });

    if (query !== '') {
      await pool.query(
        `UPDATE ${this.entity.table}
          ${query},
          updated_at = now()
        WHERE id = $1
        AND restaurant_id = $2`,
        [productId, restaurantId, ...values],
      );
    }

    const product = await this.findOne({ restaurantId, productId }, pool);

    if (!product) {
      return null;
    }

    return product;
  }

  public async delete({
    restaurantId,
    productId,
  }: {
    restaurantId: string;
    productId: string;
  }): Promise<void> {
    if (this.isValidId(restaurantId) && this.isValidId(productId)) {
      const { pool } = connection('RestaurantsRepository.deleteById');

      await pool.query(
        `DELETE FROM ${this.entity.table}
        WHERE id = $1
        AND restaurant_id = $2`,
        [productId, restaurantId],
      );
    }
  }
}
