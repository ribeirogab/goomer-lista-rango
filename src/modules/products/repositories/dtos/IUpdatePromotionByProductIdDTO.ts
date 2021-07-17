export interface IUpdatePromotionByProductIdDTO {
  productionId: string;
  description?: string;
  price: number;
  startDatetime: Date;
  finishDatetime: Date;
}
