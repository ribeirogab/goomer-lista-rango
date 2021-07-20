import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';

import { IWeekDayHours } from '../models/IWorkSchedule';

interface IWorkSchedule {
  sunday?: IWeekDayHours;
  monday?: IWeekDayHours;
  tuesday?: IWeekDayHours;
  wednesday?: IWeekDayHours;
  thursday?: IWeekDayHours;
  friday?: IWeekDayHours;
  saturday?: IWeekDayHours;
}

interface IReturn {
  status: 'valid' | 'invalid';
  message: string;
}

export function checkIfTheWorkingSchedulesAreValid(
  workSchedules: IWorkSchedule,
  dateProvider: IDateProvider,
): IReturn {
  let message = 'Success!';
  let status: 'valid' | 'invalid' = 'valid';

  Object.values(workSchedules || []).some((workSchedule, index) => {
    const startTime = workSchedule.startHour;
    const finishTime = workSchedule.finishHour;
    const key = `${Object.keys(workSchedules || [])[index]}.${
      Object.keys(workSchedule)[0]
    }`;

    if ((startTime && !finishTime) || (!startTime && finishTime)) {
      message = `Both times must be filled in the field "${key}"`;
      status = 'invalid';
      return true;
    }

    if (startTime && finishTime) {
      if (
        !dateProvider.startTimeIsLessThanFinishTime({
          startTime,
          finishTime,
        })
      ) {
        message = `End time must be later than start time in the field "${key}"`;
        status = 'invalid';
        return true;
      }

      if (
        dateProvider.differenceInMinutesBetweenTwoTimes({
          startTime,
          finishTime,
        }) < 15
      ) {
        message = `The intervals between times must be at least 15 minutes in the field "${key}"`;
        status = 'invalid';
        return true;
      }
    }

    return false;
  });

  return {
    status,
    message,
  };
}
