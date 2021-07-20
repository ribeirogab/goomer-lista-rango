export interface IDateProvider {
  differenceInMinutesBetweenTwoTimes({
    startTime,
    finishTime,
  }: {
    startTime: string;
    finishTime: string;
  }): number;

  startTimeIsLessThanFinishTime({
    startTime,
    finishTime,
  }: {
    startTime: string;
    finishTime: string;
  }): boolean;

  differenceInMinutesBetweenTwoDates({
    startDate,
    finishDate,
  }: {
    startDate: Date;
    finishDate: Date;
  }): number;

  startDateIsLessThanFinishDate({
    startDate,
    finishDate,
  }: {
    startDate: Date;
    finishDate: Date;
  }): boolean;
}
