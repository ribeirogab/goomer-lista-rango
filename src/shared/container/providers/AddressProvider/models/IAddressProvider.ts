import { IGetAddressByPostalCodeResponseDTO } from '../dtos/IGetAddressByPostalCodeDTO';

export interface IAddressProvider {
  getAddressByPostalCode(
    postalCode: string,
  ): Promise<IGetAddressByPostalCodeResponseDTO>;
}
