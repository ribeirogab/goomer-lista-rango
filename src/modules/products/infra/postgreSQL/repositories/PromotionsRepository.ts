import { Pool } from 'pg';

import { connection } from '@shared/infra/databases/postgreSQL/connection';

import { IPromotion } from '@modules/products/models/IPromotion';
import { ICreatePromotionDTO } from '@modules/products/repositories/dtos/ICreatePromotionDTO';
import { IUpdatePromotionByProductIdDTO } from '@modules/products/repositories/dtos/IUpdatePromotionByProductIdDTO';
import { IPromotionsRepository } from '@modules/products/repositories/IPromotionsRepository';

import { PromotionEntity } from '../entities/PromotionEntity';

export class PromotionsRepository implements IPromotionsRepository {
  private entity: typeof PromotionEntity;

  constructor() {
    this.entity = PromotionEntity;
  }

  public async create(
    {
      productId,
      description,
      price,
      startDatetime,
      finishDatetime,
    }: ICreatePromotionDTO,
    sharedPool?: Pool,
  ): Promise<IPromotion> {
    const pool = sharedPool ?? connection('PromotionsRepository.create').pool;

    const { rows } = await pool.query<IPromotion>(
      `INSERT INTO ${this.entity.table}
      (id, product_id, description, price, start_datetime, finish_datetime)
      VALUES (DEFAULT, $1, $2, $3, $4, $5)
      RETURNING
        id, description, price::float,
        start_datetime AS "startDatetime",
        finish_datetime AS "finishDatetime"`,
      [productId, description, price, startDatetime, finishDatetime],
    );

    const promotion = rows[0];

    return promotion;
  }

  public async updateByProductId({
    productId,
    description,
    price,
    startDatetime,
    finishDatetime,
  }: IUpdatePromotionByProductIdDTO): Promise<IPromotion | null> {
    const { pool } = connection('PromotionsRepository.updateByProductId');

    await pool.query(
      `DELETE FROM ${this.entity.table}
      WHERE product_id = $1`,
      [productId],
    );

    const promotion = await this.create(
      {
        productId,
        description,
        price,
        startDatetime,
        finishDatetime,
      },
      pool,
    );

    return promotion;
  }

  public async findByProductId(productId: string): Promise<IPromotion | null> {
    const { pool } = connection('PromotionsRepository.findByProductId');

    const { rows } = await pool.query<IPromotion>(
      `SELECT
        id, description, price::float,
        start_datetime AS "startDatetime",
        finish_datetime AS "finishDatetime"
      FROM ${this.entity.table}
      WHERE product_id = $1`,
      [productId],
    );

    return rows[0] || null;
  }
}
