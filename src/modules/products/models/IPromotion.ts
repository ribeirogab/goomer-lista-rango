export interface IPromotion {
  id: string;
  description: string;
  price: number;
  startDatetime: Date;
  finishDatetime: Date;

  createdAt: Date;
  updatedAt: Date;
}
