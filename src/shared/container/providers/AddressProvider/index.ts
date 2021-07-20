import { container } from 'tsyringe';

import { BrasilApiProvider } from './implementations/BrasilApiProvider';
import { IAddressProvider } from './models/IAddressProvider';

container.registerSingleton<IAddressProvider>(
  'AddressProvider',
  BrasilApiProvider,
);
