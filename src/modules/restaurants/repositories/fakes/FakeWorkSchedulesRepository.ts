import { IWorkSchedule } from '@modules/restaurants/models/IWorkSchedule';

import { ICreateWorkScheduleDTO } from '../dtos/ICreateWorkScheduleDTO';
import { IUpdateWorkScheduleByRestaurantIdDTO } from '../dtos/IUpdateWorkScheduleByRestaurantIdDTO';
import { IWorkSchedulesRepository } from '../IWorkSchedulesRepository';

type WeekDayName =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

type WorkScheduleEntity = {
  restaurantId: string;
  weekDay: WeekDayName;
  startHour: string;
  finishHour: string;
  createdAt: Date;
  updatedAt: Date;
};

export class FakeWorkSchedulesRepository implements IWorkSchedulesRepository {
  private workSchedules: WorkScheduleEntity[];

  constructor() {
    this.workSchedules = [];
  }

  public async create({
    restaurantId,
    workSchedules = {},
  }: ICreateWorkScheduleDTO): Promise<IWorkSchedule> {
    const defaultWorkScheduleValue = {
      startHour: null,
      finishHour: null,
    } as { startHour: string | null; finishHour: string | null };

    const workDaysWithDefaults: IWorkSchedule = {
      sunday: defaultWorkScheduleValue,
      monday: defaultWorkScheduleValue,
      tuesday: defaultWorkScheduleValue,
      wednesday: defaultWorkScheduleValue,
      thursday: defaultWorkScheduleValue,
      friday: defaultWorkScheduleValue,
      saturday: defaultWorkScheduleValue,
      ...workSchedules,
    };

    const workDaysKeys = Object.keys(workDaysWithDefaults) as WeekDayName[];
    const workDaysValues = Object.values(workDaysWithDefaults);

    workDaysKeys.forEach((key, index) => {
      const workSchedule: WorkScheduleEntity = {
        restaurantId,
        weekDay: key,
        startHour: workDaysValues[index].startHour,
        finishHour: workDaysValues[index].finishHour,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const workScheduleIndexExists = this.workSchedules.findIndex(
        schedule =>
          schedule.restaurantId === restaurantId && schedule.weekDay === key,
      );

      if (workScheduleIndexExists === -1) {
        this.workSchedules.push(workSchedule);
      } else {
        this.workSchedules[workScheduleIndexExists] = {
          ...workSchedule,
          createdAt: this.workSchedules[workScheduleIndexExists].createdAt,
        };
      }
    });

    return workDaysWithDefaults;
  }

  public async findByRestaurant({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<IWorkSchedule | null> {
    const restaurantWorkSchedules = this.workSchedules.filter(
      workSchedule => workSchedule.restaurantId === restaurantId,
    );

    if (restaurantWorkSchedules.length !== 7) {
      return null;
    }

    const restaurantWorkDays: IWorkSchedule = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const workSchedule of restaurantWorkSchedules) {
      restaurantWorkDays[workSchedule.weekDay] = {
        startHour: workSchedule.startHour,
        finishHour: workSchedule.finishHour,
      };
    }

    return restaurantWorkDays;
  }

  public async updateByRestaurantId({
    restaurantId,
    workSchedules,
  }: IUpdateWorkScheduleByRestaurantIdDTO): Promise<IWorkSchedule> {
    this.workSchedules = this.workSchedules.filter(
      workSchedule => workSchedule.restaurantId !== restaurantId,
    );

    const workDays = await this.create({ restaurantId, workSchedules });

    return workDays;
  }
}
