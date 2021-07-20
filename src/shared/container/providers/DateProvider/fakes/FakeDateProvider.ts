import { IDateProvider } from '../models/IDateProvider';

export class FakeDateProvider implements IDateProvider {
  private isValidTime(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):?([0-5]\d)$/;

    return regex.test(time);
  }

  private convertTimeToDate(time: string) {
    if (!this.isValidTime(time)) {
      throw new Error('Invalid time type, should be "HH:mm".');
    }

    const timeObject = {
      hours: Number(time.split(':')[0]),
      minutes: Number(time.split(':')[1]),
    };

    const date = new Date(
      new Date().setHours(timeObject.hours, timeObject.minutes, 0),
    );

    return date;
  }

  public differenceInMinutesBetweenTwoTimes({
    startTime,
    finishTime,
  }: {
    startTime: string;
    finishTime: string;
  }): number {
    const startDatetime = this.convertTimeToDate(startTime);
    const finishDatetime = this.convertTimeToDate(finishTime);

    const msDifference = finishDatetime.getTime() - startDatetime.getTime();
    const minutes = Math.floor(msDifference / 1000 / 60);

    return minutes;
  }

  public startTimeIsLessThanFinishTime({
    startTime,
    finishTime,
  }: {
    startTime: string;
    finishTime: string;
  }): boolean {
    const startDatetime = this.convertTimeToDate(startTime);
    const finishDatetime = this.convertTimeToDate(finishTime);

    return startDatetime < finishDatetime;
  }

  public differenceInMinutesBetweenTwoDates({
    startDate,
    finishDate,
  }: {
    startDate: Date;
    finishDate: Date;
  }): number {
    const msDifference = finishDate.getTime() - startDate.getTime();
    const minutes = Math.floor(msDifference / 1000 / 60);

    return minutes;
  }

  public startDateIsLessThanFinishDate({
    startDate,
    finishDate,
  }: {
    startDate: Date;
    finishDate: Date;
  }): boolean {
    return startDate < finishDate;
  }
}
