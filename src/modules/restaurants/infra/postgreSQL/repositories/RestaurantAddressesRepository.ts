import { Pool } from 'pg';
import format from 'pg-format';

import { connection } from '@shared/infra/databases/postgreSQL/connection';

import { IRestaurantAddress } from '@modules/restaurants/models/IRestaurantAddress';
import { ICreateManyRestaurantAddressesDTO } from '@modules/restaurants/repositories/dtos/ICreateManyRestaurantAddressesDTO';
import { IUpdateRestaurantAddressesByRestaurantIdDTO } from '@modules/restaurants/repositories/dtos/IUpdateRestaurantAddressesByRestaurantIdDTO';
import { IRestaurantAddressesRepository } from '@modules/restaurants/repositories/IRestaurantAddressesRepository';

import { RestaurantAddressEntity } from '../entities/RestaurantAddressEntity';

export class RestaurantAddressesRepository
  implements IRestaurantAddressesRepository
{
  private entity: typeof RestaurantAddressEntity;

  constructor() {
    this.entity = RestaurantAddressEntity;
  }

  public async createMany(
    { restaurantId, addresses }: ICreateManyRestaurantAddressesDTO,
    sharedPool?: Pool,
  ): Promise<IRestaurantAddress[]> {
    const pool =
      sharedPool ?? connection('RestaurantAddressesRepository.createMany').pool;

    const restaurantAddressesValues = addresses.map(address => [
      restaurantId,
      address.postalCode,
      address.number,
    ]);

    await pool.query(
      format(
        `INSERT INTO ${this.entity.table}
        (restaurant_id, address_postal_code, number)
        VALUES %L`,
        restaurantAddressesValues,
      ),
    );

    const restaurantAddresses = await this.findByRestaurantId(
      restaurantId,
      pool,
    );

    return restaurantAddresses;
  }

  public async findByRestaurantId(
    restaurantId: string,
    sharedPool?: Pool,
  ): Promise<IRestaurantAddress[]> {
    const pool =
      sharedPool ?? connection('RestaurantAddressesRepository.createMany').pool;

    const { rows: restaurantAddresses } = await pool.query<IRestaurantAddress>(
      `SELECT
          ra.address_postal_code AS "postalCode",
          ad.state, ad.city, ad.neighborhood, ra.number, ad.country,
          ad.country_code AS "countryCode",
          ra.created_at AS "createdAt",
          ra.updated_at AS "updatedAt"
        FROM ${this.entity.table} ra
          INNER JOIN ${this.entity.relations.addresses.table} ad
            ON ra.address_postal_code = ad.postal_code
        WHERE ra.restaurant_id = $1
        GROUP BY ra.restaurant_id,
          ra.address_postal_code,
          ra.number,
          ad.postal_code`,
      [restaurantId],
    );

    return restaurantAddresses;
  }

  public async updateByRestaurantId({
    restaurantId,
    addresses,
  }: IUpdateRestaurantAddressesByRestaurantIdDTO): Promise<
    IRestaurantAddress[]
  > {
    const { pool } = connection(
      'RestaurantAddressesRepository.updateByRestaurantId',
    );

    await pool.query(
      `DELETE FROM ${this.entity.table} WHERE restaurant_id = $1`,
      [restaurantId],
    );

    const restaurantAddresses = await this.createMany(
      {
        restaurantId,
        addresses,
      },
      pool,
    );

    return restaurantAddresses;
  }
}
