export interface ICreatePromotionDTO {
  productionId: string;
  description?: string;
  price: number;
  startDatetime: Date;
  finishDatetime: Date;
}
