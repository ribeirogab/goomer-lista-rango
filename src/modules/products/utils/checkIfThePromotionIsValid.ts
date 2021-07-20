import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';

type Promotion = {
  description?: string;
  price: number;
  startDatetime: Date;
  finishDatetime: Date;
};

interface IReturn {
  status: 'valid' | 'invalid';
  message: string;
}

export function checkIfThePromotionIsValid(
  promotion: Promotion,
  dateProvider: IDateProvider,
): IReturn {
  const startDate = new Date(promotion.startDatetime);
  const finishDate = new Date(promotion.finishDatetime);

  if (!dateProvider.startDateIsLessThanFinishDate({ startDate, finishDate })) {
    return {
      message: `End promotion time must be later than start promotion time`,
      status: 'invalid',
    };
  }

  if (
    dateProvider.differenceInMinutesBetweenTwoDates({ startDate, finishDate }) <
    15
  ) {
    return {
      message: `Intervals between promotion times must be at least 15 minutes`,
      status: 'invalid',
    };
  }

  return { status: 'valid', message: 'Success!' };
}
