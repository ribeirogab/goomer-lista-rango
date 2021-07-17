import { IAddressesRepository } from '@modules/addresses/repositories/IAddressesRepository';

export interface ICreateAddressesIfItDoesNotExistDTO {
  addressesRepository: IAddressesRepository;
  addresses: {
    postalCode: string;
    number: number;
  }[];
}
