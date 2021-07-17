export interface ICreateProductDTO {
  restaurantId: string;
  categoryId: string;
  promotionId?: string;
  name: string;
  price: number;
}
