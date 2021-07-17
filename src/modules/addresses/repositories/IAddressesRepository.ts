import { IAddress } from '../models/IAddress';
import { ICreateAddressDTO } from './dtos/ICreateAddressDTO';

export interface IAddressesRepository {
  create({
    postalCode,
    state,
    city,
    neighborhood,
    street,
    country,
    countryCode,
  }: ICreateAddressDTO): Promise<IAddress>;

  findByPostalCode(postalCode: string): Promise<IAddress | null>;
}
