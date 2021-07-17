import { IAddress } from '@modules/addresses/models/IAddress';

import { ICreateAddressDTO } from '../dtos/ICreateAddressDTO';
import { IAddressesRepository } from '../IAddressesRepository';

export class FakeAddressesRepository implements IAddressesRepository {
  private addresses: IAddress[];

  constructor() {
    this.addresses = [];
  }

  public async create({
    postalCode,
    state,
    city,
    neighborhood,
    street,
    country,
    countryCode,
  }: ICreateAddressDTO): Promise<IAddress> {
    const address: IAddress = {
      postalCode,
      state,
      city,
      neighborhood,
      street,
      country,
      countryCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.addresses.push(address);

    return address;
  }

  public async findByPostalCode(postalCode: string): Promise<IAddress | null> {
    const foundAddress = this.addresses.find(
      address => address.postalCode === postalCode,
    );

    return foundAddress || null;
  }
}
