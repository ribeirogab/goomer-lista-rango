export interface ICreateManyRestaurantAddressesDTO {
  restaurantId: string;
  addresses: {
    postalCode: string;
    number: number;
  }[];
}
