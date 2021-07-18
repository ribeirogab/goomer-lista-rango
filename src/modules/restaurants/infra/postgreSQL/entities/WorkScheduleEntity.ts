import { IWorkSchedule } from '@modules/restaurants/models/IWorkSchedule';

type WeekDayName =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export class WorkScheduleEntity {
  public static table = 'work_schedules';
  public static weekDays: WeekDayName[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  public restaurant_id: string;
  public week_day: WeekDayName;
  public start_hour: string;
  public finish_hour: string;

  public created_at: Date;
  public updated_at: Date;

  public static formatWorkSchedules(
    workSchedules: WorkScheduleEntity[],
  ): IWorkSchedule {
    const formattedWorkSchedules: IWorkSchedule = {};

    workSchedules.forEach(workSchedule => {
      formattedWorkSchedules[workSchedule.week_day] = {
        startHour: workSchedule.start_hour,
        finishHour: workSchedule.finish_hour,
      };
    });

    return formattedWorkSchedules;
  }
}
