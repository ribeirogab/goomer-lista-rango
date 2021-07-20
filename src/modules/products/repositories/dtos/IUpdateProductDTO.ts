export interface IUpdateProductDTO {
  restaurantId: string;
  productId: string;
  categoryId?: string;
  name?: string;
  image?: string;
  price?: number;
}
