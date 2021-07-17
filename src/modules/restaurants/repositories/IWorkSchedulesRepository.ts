import { IWorkSchedule } from '../models/IWorkSchedule';
import { ICreateWorkScheduleDTO } from './dtos/ICreateWorkScheduleDTO';

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
}
