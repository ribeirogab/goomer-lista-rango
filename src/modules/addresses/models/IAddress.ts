export interface IAddress {
  postalCode: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  country: string;
  countryCode: string;

  // timestamps
  createdAt: Date;
  updatedAt: Date;
}
