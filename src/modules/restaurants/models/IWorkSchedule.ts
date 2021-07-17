export interface IWeekDayHours {
  startHour: string | null;
  finishHour: string | null;
}

export interface IWorkSchedule {
  sunday?: IWeekDayHours;
  monday?: IWeekDayHours;
  tuesday?: IWeekDayHours;
  wednesday?: IWeekDayHours;
  thursday?: IWeekDayHours;
  friday?: IWeekDayHours;
  saturday?: IWeekDayHours;
}
