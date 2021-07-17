export interface IRestaurantAddress {
  postalCode: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: number;
  country: string;
  countryCode: string;

  createdAt: Date;
  updatedAt: Date;
}
