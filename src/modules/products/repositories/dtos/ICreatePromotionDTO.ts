export interface ICreatePromotionDTO {
  productId: string;
  description?: string;
  price: number;
  startDatetime: Date;
  finishDatetime: Date;
}
