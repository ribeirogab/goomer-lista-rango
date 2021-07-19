import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { IAddressProvider } from '@shared/container/providers/AddressProvider/models/IAddressProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { IAddressesRepository } from '@modules/addresses/repositories/IAddressesRepository';

import { IRestaurant } from '../models/IRestaurant';
import { IWeekDayHours } from '../models/IWorkSchedule';
import { IRestaurantAddressesRepository } from '../repositories/IRestaurantAddressesRepository';
import { IRestaurantsRepository } from '../repositories/IRestaurantsRepository';
import { IWorkSchedulesRepository } from '../repositories/IWorkSchedulesRepository';

type WorkSchedules = {
  sunday?: IWeekDayHours;
  monday?: IWeekDayHours;
  tuesday?: IWeekDayHours;
  wednesday?: IWeekDayHours;
  thursday?: IWeekDayHours;
  friday?: IWeekDayHours;
  saturday?: IWeekDayHours;
};

type Address = {
  postalCode: string;
  number: string;
}[];

interface IRequest {
  restaurantId: string;
  name?: string;
  addresses?: Address;
  workSchedules?: WorkSchedules;
}

@injectable()
export class UpdateRestaurantService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('RestaurantAddressesRepository')
    private restaurantAddressesRepository: IRestaurantAddressesRepository,

    @inject('WorkSchedulesRepository')
    private workSchedulesRepository: IWorkSchedulesRepository,

    @inject('AddressProvider')
    private AddressProvider: IAddressProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    restaurantId,
    name,
    addresses: inputAddresses,
    workSchedules,
  }: IRequest): Promise<IRestaurant> {
    const restaurantExists = await this.restaurantsRepository.findById(
      restaurantId,
    );

    if (!restaurantExists) {
      throw new AppError('Restaurant does not exist.', 400);
    }

    if (inputAddresses) {
      const addresses =
        await this.AddressProvider.createAddressesIfItDoesNotExist({
          addresses: inputAddresses,
          addressesRepository: this.addressesRepository,
        });
      await this.restaurantAddressesRepository.updateByRestaurantId({
        restaurantId,
        addresses,
      });
    }

    if (workSchedules) {
      await this.workSchedulesRepository.updateByRestaurantId({
        restaurantId,
        workSchedules,
      });
    }

    const updatedRestaurant = (await this.restaurantsRepository.updateById(
      restaurantId,
      { name },
    )) as IRestaurant;

    await this.cacheProvider.invalidatePrefix('restaurant-list');
    await this.cacheProvider.invalidate(`restaurant:${restaurantId}`);

    return updatedRestaurant;
  }
}
