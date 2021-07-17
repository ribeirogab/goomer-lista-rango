import { container } from 'tsyringe';

import { PaginationProvider } from './implementations/PaginationProvider';
import { IPaginationProvider } from './models/IPaginationProvider';

container.registerSingleton<IPaginationProvider>(
  'PaginationProvider',
  PaginationProvider,
);
