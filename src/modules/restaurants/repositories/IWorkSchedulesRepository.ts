import { IWorkSchedule } from '../models/IWorkSchedule';
import { ICreateWorkScheduleDTO } from './dtos/ICreateWorkScheduleDTO';
import { IUpdateWorkScheduleByRestaurantIdDTO } from './dtos/IUpdateWorkScheduleByRestaurantIdDTO';

export interface IWorkSchedulesRepository {
  create({
    restaurantId,
    workSchedules,
  }: ICreateWorkScheduleDTO): Promise<IWorkSchedule>;

  findByRestaurant({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<IWorkSchedule | null>;

  updateByRestaurantId({
    restaurantId,
    workSchedules,
  }: IUpdateWorkScheduleByRestaurantIdDTO): Promise<IWorkSchedule>;
}
