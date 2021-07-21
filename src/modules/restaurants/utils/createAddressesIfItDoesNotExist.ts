import { IAddressProvider } from '@shared/container/providers/AddressProvider/models/IAddressProvider';

import { IAddressesRepository } from '@modules/addresses/repositories/IAddressesRepository';

interface IAddress {
  postalCode: string;
  number: string;
}

export async function createAddressesIfItDoesNotExist(
  informedAddresses: IAddress[],
  addressesRepository: IAddressesRepository,
  addressProvider: IAddressProvider,
): Promise<{ postalCode: string; number: string }[]> {
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
      } = await addressProvider.getAddressByPostalCode(
        informedAddress.postalCode,
      );

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
