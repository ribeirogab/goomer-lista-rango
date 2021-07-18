import { container } from 'tsyringe';

import { RestaurantAddressesRepository } from '@modules/restaurants/infra/postgreSQL/repositories/RestaurantAddressesRepository';
import { RestaurantsRepository } from '@modules/restaurants/infra/postgreSQL/repositories/RestaurantsRepository';
import { WorkSchedulesRepository } from '@modules/restaurants/infra/postgreSQL/repositories/WorkSchedulesRepository';
import { IRestaurantAddressesRepository } from '@modules/restaurants/repositories/IRestaurantAddressesRepository';
import { IRestaurantsRepository } from '@modules/restaurants/repositories/IRestaurantsRepository';
import { IWorkSchedulesRepository } from '@modules/restaurants/repositories/IWorkSchedulesRepository';

container.registerSingleton<IRestaurantsRepository>(
  'RestaurantsRepository',
  RestaurantsRepository,
);

container.registerSingleton<IRestaurantAddressesRepository>(
  'RestaurantAddressesRepository',
  RestaurantAddressesRepository,
);

container.registerSingleton<IWorkSchedulesRepository>(
  'WorkSchedulesRepository',
  WorkSchedulesRepository,
);
