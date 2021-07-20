import axios, { AxiosInstance } from 'axios';

import { AppError } from '@shared/errors/AppError';

import { ICreateAddressesIfItDoesNotExistDTO } from '../dtos/ICreateAddressesIfItDoesNotExistDTO';
import { IGetAddressByPostalCodeResponseDTO } from '../dtos/IGetAddressByPostalCodeDTO';
import { IAddressProvider } from '../models/IAddressProvider';

interface IPostmonApiCepResponse {
  bairro: string;
  cidade: string;
  logradouro: string;
  cep: string;
  estado: string;
}

export class PostmonProvider implements IAddressProvider {
  private postmonApi: AxiosInstance;

  constructor() {
    this.postmonApi = axios.create({
      baseURL: 'https://api.postmon.com.br/v1/cep',
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
      const { data } = await this.postmonApi.get<IPostmonApiCepResponse>(
        `/${postalCode}`,
      );

      const { cep, estado, cidade, bairro, logradouro } = data;

      const addressInfo = {
        postalCode: cep,
        state: estado,
        city: cidade,
        neighborhood: bairro,
        street: logradouro,
        country: 'Brasil',
        countryCode: 'BR',
      };

      return addressInfo;
    } catch (error) {
      throw new AppError(`Invalid postal code: ${postalCode}`, 400);
    }
  }
}
