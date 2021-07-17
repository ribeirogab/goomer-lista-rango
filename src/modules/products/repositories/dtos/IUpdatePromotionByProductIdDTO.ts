export interface IUpdatePromotionByProductIdDTO {
  productId: string;
  description?: string;
  price?: number;
  startDatetime?: Date;
  finishDatetime?: Date;
}
