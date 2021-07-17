export interface IPromotion {
  id: string;
  description: string | null;
  price: number;
  startDatetime: Date;
  finishDatetime: Date;
}
