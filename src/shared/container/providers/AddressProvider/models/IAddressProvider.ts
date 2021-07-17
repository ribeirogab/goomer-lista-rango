import { ICreateAddressesIfItDoesNotExistDTO } from '../dtos/ICreateAddressesIfItDoesNotExistDTO';
import { IGetAddressByPostalCodeResponseDTO } from '../dtos/IGetAddressByPostalCodeDTO';

export interface IAddressProvider {
  createAddressesIfItDoesNotExist({
    addressesRepository,
    addresses,
  }: ICreateAddressesIfItDoesNotExistDTO): Promise<
    {
      postalCode: string;
      number: number;
    }[]
  >;

  getAddressByPostalCode(
    postalCode: string,
  ): Promise<IGetAddressByPostalCodeResponseDTO>;
}
