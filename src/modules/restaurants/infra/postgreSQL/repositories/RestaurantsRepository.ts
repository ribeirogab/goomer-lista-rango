import { Pool } from 'pg';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

import { connection } from '@shared/infra/databases/postgreSQL/connection';

import { IRestaurant } from '@modules/restaurants/models/IRestaurant';
import { IRestaurantAddress } from '@modules/restaurants/models/IRestaurantAddress';
import { IFindAllRestaurantsDTO } from '@modules/restaurants/repositories/dtos/IFindAllRestaurantsDTO';
import { IUpdateRestaurantByIdDTO } from '@modules/restaurants/repositories/dtos/IUpdateRestaurantByIdDTO';
import { IRestaurantsRepository } from '@modules/restaurants/repositories/IRestaurantsRepository';

import { RestaurantEntity } from '../entities/RestaurantEntity';
import { WorkScheduleEntity } from '../entities/WorkScheduleEntity';

export class RestaurantsRepository implements IRestaurantsRepository {
  private entity: typeof RestaurantEntity;

  constructor() {
    this.entity = RestaurantEntity;
  }

  private isValidId(id: string) {
    return uuidValidate(id) && uuidVersion(id) === 4;
  }

  public async create({
    name,
  }: {
    name: string;
  }): Promise<Omit<IRestaurant, 'addresses' | 'workSchedules'>> {
    const { pool } = connection('RestaurantsRepository.findAll');

    const { rows } = await pool.query<RestaurantEntity>(
      `INSERT INTO ${this.entity.table}(id, name) VALUES(DEFAULT, $1)
      RETURNING *`,
      [name],
    );

    const restaurant = this.entity.formatRestaurant(rows[0]);

    return restaurant;
  }

  public async findAll({ page, perPage }: IFindAllRestaurantsDTO): Promise<{
    count: number;
    restaurants: IRestaurant[];
  }> {
    const { pool } = connection('RestaurantsRepository.findAll');

    const { rows } = await pool.query<
      RestaurantEntity & {
        workSchedules: WorkScheduleEntity[];
        addresses: IRestaurantAddress[];
      }
    >(
      `SELECT
        r.*,
        jsonb_agg(
          DISTINCT
          jsonb_build_object(
            'week_day', ws.week_day,
            'start_hour', ws.start_hour,
            'finish_hour', ws.finish_hour
          )
        ) AS "workSchedules",
        jsonb_agg(
          DISTINCT
          jsonb_build_object(
            'postalCode', ad.postal_code,
            'state', ad.state,
            'city', ad.city,
            'neighborhood', ad.neighborhood,
            'street', ad.street,
            'number', ra.number,
            'country', ad.country,
            'countryCode', ad.country_code,
            'createdAt', ra.created_at,
            'updatedAt', ra.updated_at
          )
        ) AS "addresses"
      FROM ${this.entity.table} r
        INNER JOIN ${this.entity.relations.workSchedules.table} AS ws
          ON ws.restaurant_id = r.id
        INNER JOIN ${this.entity.relations.restaurantAddresses.table} AS ra
          ON ra.restaurant_id = r.id
        INNER JOIN ${this.entity.relations.restaurantAddresses.relations.addresses.table} AS ad
          ON ra.address_postal_code = ad.postal_code
      GROUP BY r.id
      OFFSET $1 LIMIT $2`,
      [(page - 1) * perPage, perPage],
    );

    const { count } = (
      await pool.query<{ count: string }>(
        `SELECT count(*) AS count FROM ${this.entity.table}`,
      )
    ).rows[0];

    const formattedRestaurants: IRestaurant[] = rows.map(restaurant => {
      const formattedWorkSchedules =
        this.entity.relations.workSchedules.formatWorkSchedules(
          restaurant.workSchedules,
        );

      const { addresses } = restaurant;

      const formattedRestaurant: IRestaurant = {
        ...this.entity.formatRestaurant(restaurant),
        workSchedules: formattedWorkSchedules,
        addresses,
      };

      return formattedRestaurant;
    });

    return { count: Number(count), restaurants: formattedRestaurants };
  }

  public async findById(
    restaurantId: string,
    sharedPool?: Pool,
  ): Promise<IRestaurant | null> {
    if (!this.isValidId(restaurantId)) {
      return null;
    }

    const pool =
      sharedPool ?? connection('RestaurantsRepository.findById').pool;

    const { rows } = await pool.query<
      RestaurantEntity & {
        workSchedules: WorkScheduleEntity[];
        addresses: IRestaurantAddress[];
      }
    >(
      `SELECT
      r.*,
      jsonb_agg(
        DISTINCT
        jsonb_build_object(
          'week_day', ws.week_day,
          'start_hour', ws.start_hour,
          'finish_hour', ws.finish_hour
        )
      ) AS "workSchedules",
      jsonb_agg(
        DISTINCT
        jsonb_build_object(
          'postalCode', ad.postal_code,
          'state', ad.state,
          'city', ad.city,
          'neighborhood', ad.neighborhood,
          'street', ad.street,
          'number', ra.number,
          'country', ad.country,
          'countryCode', ad.country_code,
          'createdAt', ra.created_at,
          'updatedAt', ra.updated_at
        )
      ) AS "addresses"
      FROM ${this.entity.table} r
        INNER JOIN ${this.entity.relations.workSchedules.table} AS ws
          ON ws.restaurant_id = r.id
        INNER JOIN ${this.entity.relations.restaurantAddresses.table} AS ra
          ON ra.restaurant_id = r.id
        INNER JOIN ${this.entity.relations.restaurantAddresses.relations.addresses.table} AS ad
          ON ra.address_postal_code = ad.postal_code
      WHERE r.id = $1
      GROUP BY r.id`,
      [restaurantId],
    );

    if (!rows[0]?.id) {
      return null;
    }

    const restaurant = rows[0];

    const formattedWorkSchedules =
      this.entity.relations.workSchedules.formatWorkSchedules(
        restaurant.workSchedules,
      );

    const { addresses } = restaurant;

    const formattedRestaurant: IRestaurant = {
      ...this.entity.formatRestaurant(restaurant),
      workSchedules: formattedWorkSchedules,
      addresses,
    };

    return formattedRestaurant;
  }

  public async updateById(
    restaurantId: string,
    { name, image }: IUpdateRestaurantByIdDTO,
  ): Promise<IRestaurant | null> {
    if (!this.isValidId(restaurantId)) {
      return null;
    }

    const { pool } = connection('RestaurantsRepository.updateById');

    const values: string[] = [];
    let query = '';

    const possibleValuesToBeUpdated = [{ name }, { image }];

    possibleValuesToBeUpdated.forEach(objectValue => {
      const value = Object.values(objectValue)[0];

      if (value) {
        const key = Object.keys(objectValue)[0];

        query += `${values.length > 0 ? ', ' : 'SET '}${key} = $${
          values.length + 2
        }`;
        values.push(value);
      }
    });

    if (query !== '') {
      await pool.query(
        `UPDATE ${this.entity.table}
          ${query},
          updated_at = now()
        WHERE id = $1`,
        [restaurantId, ...values],
      );
    }

    const updatedRestaurant = await this.findById(restaurantId, pool);

    return updatedRestaurant;
  }

  public async deleteById(restaurantId: string): Promise<void> {
    if (this.isValidId(restaurantId)) {
      const { pool } = connection('RestaurantsRepository.deleteById');

      await pool.query(`DELETE FROM ${this.entity.table} WHERE id = $1`, [
        restaurantId,
      ]);
    }
  }
}
