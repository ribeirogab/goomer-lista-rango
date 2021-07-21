import { IGetAddressByPostalCodeResponseDTO } from '../dtos/IGetAddressByPostalCodeDTO';
import { IAddressProvider } from '../models/IAddressProvider';

export class FakeAddressProvider implements IAddressProvider {
  public async getAddressByPostalCode(
    postalCode: string,
  ): Promise<IGetAddressByPostalCodeResponseDTO> {
    const addressInfo = {
      postalCode,
      state: 'SP',
      city: 'Sorocaba',
      neighborhood: 'Jardim America',
      street: 'R. Martinica',
      country: 'Brasil',
      countryCode: 'BR',
    };

    return addressInfo;
  }
}
