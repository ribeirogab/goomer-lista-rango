export interface IPromotion {
  id: string;
  description: string | null;
  price: number;

  startsAt: {
    day: number;
    month: number;
    year: number;
    time: string;
    datetime: Date;
  };

  finishAt: {
    day: number;
    month: number;
    year: number;
    time: string;
    datetime: Date;
  };
}
