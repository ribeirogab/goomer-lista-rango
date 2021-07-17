export interface IUpdateProductDTO {
  restaurantId: string;
  productId: string;
  categoryId: string;
  name?: string;
  price?: number;
}
