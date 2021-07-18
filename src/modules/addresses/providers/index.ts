import { container } from 'tsyringe';

import { AddressesRepository } from '@modules/addresses/infra/postgreSQL/repositories/AddressesRepository';
import { IAddressesRepository } from '@modules/addresses/repositories/IAddressesRepository';

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  AddressesRepository,
);
