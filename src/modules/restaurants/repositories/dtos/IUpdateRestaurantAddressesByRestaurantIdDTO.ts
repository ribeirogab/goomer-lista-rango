export interface IUpdateRestaurantAddressesByRestaurantIdDTO {
  restaurantId: string;
  addresses: {
    postalCode: string;
    number: string;
  }[];
}
