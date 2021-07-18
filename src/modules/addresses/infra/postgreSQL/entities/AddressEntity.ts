import { IAddress } from '@modules/addresses/models/IAddress';

export class AddressEntity {
  public static table = 'addresses';

  public postal_code: string;
  public state: string;
  public city: string;
  public neighborhood: string;
  public street: string;
  public country: string;
  public country_code: string;

  public created_at: Date;
  public updated_at: Date;

  public static formatAddress(address: AddressEntity): IAddress {
    const {
      postal_code,
      state,
      city,
      neighborhood,
      street,
      country,
      country_code,
      created_at,
      updated_at,
    } = address;

    const formattedKeysAddress: IAddress = {
      postalCode: postal_code,
      state,
      city,
      neighborhood,
      street,
      country,
      countryCode: country_code,
      createdAt: created_at,
      updatedAt: updated_at,
    };

    return formattedKeysAddress;
  }
}
