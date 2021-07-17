import { IWorkSchedule } from '../models/IWorkSchedule';
import { ICreateWorkScheduleDTO } from './dtos/ICreateWorkScheduleDTO';

export interface IWorkSchedulesRepository {
  create({
    restaurantId,
    weekDayName,
    startHour,
    finishHour,
  }: ICreateWorkScheduleDTO): Promise<IWorkSchedule>;

  findByRestaurant({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<IWorkSchedule[]>;
}
