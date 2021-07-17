import { ICreateAddressesIfItDoesNotExistDTO } from '../dtos/ICreateAddressesIfItDoesNotExistDTO';
import { IGetAddressByPostalCodeResponseDTO } from '../dtos/IGetAddressByPostalCodeDTO';
import { IAddressProvider } from '../models/IAddressProvider';

export class FakeAddressProvider implements IAddressProvider {
  public async createAddressesIfItDoesNotExist({
    addressesRepository,
    addresses: informedAddresses,
  }: ICreateAddressesIfItDoesNotExistDTO): Promise<
    { postalCode: string; number: number }[]
  > {
    const addressesPromises = informedAddresses.map(async informedAddress => {
      let address = await addressesRepository.findByPostalCode(
        informedAddress.postalCode,
      );

      if (!address) {
        const {
          postalCode,
          state,
          city,
          neighborhood,
          street,
          country,
          countryCode,
        } = await this.getAddressByPostalCode(informedAddress.postalCode);

        address = await addressesRepository.create({
          postalCode,
          state,
          city,
          neighborhood,
          street,
          country,
          countryCode,
        });
      }

      return { postalCode: address.postalCode, number: informedAddress.number };
    });

    const addresses = await Promise.all(addressesPromises);

    return addresses;
  }

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
