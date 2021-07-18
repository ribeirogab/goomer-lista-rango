import axios, { AxiosInstance } from 'axios';

import { AppError } from '@shared/errors/AppError';

import { ICreateAddressesIfItDoesNotExistDTO } from '../dtos/ICreateAddressesIfItDoesNotExistDTO';
import { IGetAddressByPostalCodeResponseDTO } from '../dtos/IGetAddressByPostalCodeDTO';
import { IAddressProvider } from '../models/IAddressProvider';

interface IBrasilApiCepResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

export class BrasilApiProvider implements IAddressProvider {
  private brasilApi: AxiosInstance;

  constructor() {
    this.brasilApi = axios.create({
      baseURL: 'https://brasilapi.com.br/api/cep/v1',
    });
  }

  public async createAddressesIfItDoesNotExist({
    addressesRepository,
    addresses: informedAddresses,
  }: ICreateAddressesIfItDoesNotExistDTO): Promise<
    { postalCode: string; number: string }[]
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
    try {
      const { data } = await this.brasilApi.get<IBrasilApiCepResponse>(
        `/${postalCode}`,
      );

      const { cep, state, city, neighborhood, street } = data;

      const addressInfo = {
        postalCode: cep,
        state,
        city,
        neighborhood,
        street,
        country: 'Brasil',
        countryCode: 'BR',
      };

      return addressInfo;
    } catch (error) {
      throw new AppError(`Invalid postal code: ${postalCode}`, 400);
    }
  }
}
