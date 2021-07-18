import { Pool } from 'pg';

import { connection } from '@shared/infra/databases/postgreSQL/connection';

import { IAddress } from '@modules/addresses/models/IAddress';
import { ICreateAddressDTO } from '@modules/addresses/repositories/dtos/ICreateAddressDTO';
import { IAddressesRepository } from '@modules/addresses/repositories/IAddressesRepository';

import { AddressEntity } from '../entities/AddressEntity';

export class AddressesRepository implements IAddressesRepository {
  private entity: typeof AddressEntity;
  private pool: Pool;

  constructor() {
    this.entity = AddressEntity;
    this.pool = connection('AddressRepository').pool;
  }

  public async create({
    postalCode,
    state,
    city,
    neighborhood,
    street,
    country,
    countryCode,
  }: ICreateAddressDTO): Promise<IAddress> {
    const { rows } = await this.pool.query<AddressEntity>(
      `INSERT INTO ${this.entity.table}
      (postal_code, state, city, neighborhood, street, country, country_code)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [postalCode, state, city, neighborhood, street, country, countryCode],
    );

    const address = this.entity.formatAddress(rows[0]);

    return address;
  }

  public async findByPostalCode(postalCode: string): Promise<IAddress | null> {
    const { rows } = await this.pool.query<IAddress>(
      `SELECT
      postal_code AS "postalCode",
      state, city, neighborhood, street, country,
      country_code AS "countryCode"
      FROM ${this.entity.table} WHERE postal_code = $1`,
      [postalCode],
    );

    const address = rows[0];

    return address;
  }
}
