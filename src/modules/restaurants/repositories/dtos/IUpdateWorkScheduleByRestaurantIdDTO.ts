type WeekDayHours = {
  startHour: string | null;
  finishHour: string | null;
};

type WorkSchedules = {
  sunday?: WeekDayHours;
  monday?: WeekDayHours;
  tuesday?: WeekDayHours;
  wednesday?: WeekDayHours;
  thursday?: WeekDayHours;
  friday?: WeekDayHours;
  saturday?: WeekDayHours;
};

export interface IUpdateWorkScheduleByRestaurantIdDTO {
  restaurantId: string;
  workSchedules: WorkSchedules;
}
