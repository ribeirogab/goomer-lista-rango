type WeekDayName =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface ICreateWorkScheduleDTO {
  restaurantId: string;
  weekDayName: WeekDayName;
  startHour: string | null;
  finishHour: string | null;
}
