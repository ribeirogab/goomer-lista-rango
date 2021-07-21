import axios, { AxiosInstance } from 'axios';

import { AppError } from '@shared/errors/AppError';

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
