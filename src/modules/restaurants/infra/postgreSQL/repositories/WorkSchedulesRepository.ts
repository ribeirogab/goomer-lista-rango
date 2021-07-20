import { Pool } from 'pg';
import format from 'pg-format';

import { connection } from '@shared/infra/databases/postgreSQL/connection';

import { IWorkSchedule } from '@modules/restaurants/models/IWorkSchedule';
import { ICreateWorkScheduleDTO } from '@modules/restaurants/repositories/dtos/ICreateWorkScheduleDTO';
import { IUpdateWorkScheduleByRestaurantIdDTO } from '@modules/restaurants/repositories/dtos/IUpdateWorkScheduleByRestaurantIdDTO';
import { IWorkSchedulesRepository } from '@modules/restaurants/repositories/IWorkSchedulesRepository';

import { WorkScheduleEntity } from '../entities/WorkScheduleEntity';

export class WorkSchedulesRepository implements IWorkSchedulesRepository {
  private entity: typeof WorkScheduleEntity;

  constructor() {
    this.entity = WorkScheduleEntity;
  }

  public async create(
    { restaurantId, workSchedules }: ICreateWorkScheduleDTO,
    sharedPool?: Pool,
  ): Promise<IWorkSchedule> {
    const pool =
      sharedPool ?? connection('WorkSchedulesRepository.create').pool;

    const workScheduleValues = this.entity.weekDays.map(day => [
      restaurantId,
      day,
      workSchedules?.[day]?.startHour || null,
      workSchedules?.[day]?.finishHour || null,
    ]);

    const { rows } = await pool.query<WorkScheduleEntity>(
      format(
        `INSERT INTO ${this.entity.table}
        (restaurant_id, week_day, start_hour, finish_hour)
        VALUES %L
        RETURNING *`,
        workScheduleValues,
      ),
    );

    const formattedWorkSchedules = this.entity.formatWorkSchedules(rows);

    return formattedWorkSchedules;
  }

  public async findByRestaurant({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<IWorkSchedule | null> {
    const { pool } = connection('WorkSchedulesRepository.findByRestaurant');

    const { rows } = await pool.query<WorkScheduleEntity>(
      `SELECT * FROM ${this.entity.table} WHERE restaurant_id = $1`,
      [restaurantId],
    );

    const formattedWorkSchedules = this.entity.formatWorkSchedules(rows);

    return formattedWorkSchedules;
  }

  public async updateByRestaurantId({
    restaurantId,
    workSchedules,
  }: IUpdateWorkScheduleByRestaurantIdDTO): Promise<IWorkSchedule> {
    const { pool } = connection('WorkSchedulesRepository.updateByRestaurantId');

    await pool.query(
      `DELETE FROM ${this.entity.table}
      WHERE restaurant_id = $1`,
      [restaurantId],
    );

    const formattedWorkSchedules = await this.create(
      { restaurantId, workSchedules },
      pool,
    );

    return formattedWorkSchedules;
  }
}
