export type WeekDayName =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type WeekDayDTO = {
  startHour: string | null;
  finishHour: string | null;
};

export interface IWorkSchedule {
  sunday?: WeekDayDTO;
  monday?: WeekDayDTO;
  tuesday?: WeekDayDTO;
  wednesday?: WeekDayDTO;
  thursday?: WeekDayDTO;
  friday?: WeekDayDTO;
  saturday?: WeekDayDTO;
}
