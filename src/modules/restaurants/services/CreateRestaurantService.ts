import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { IAddressProvider } from '@shared/container/providers/AddressProvider/models/IAddressProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';

import { IAddressesRepository } from '@modules/addresses/repositories/IAddressesRepository';

import { IRestaurant } from '../models/IRestaurant';
import { IWeekDayHours } from '../models/IWorkSchedule';
import { IRestaurantAddressesRepository } from '../repositories/IRestaurantAddressesRepository';
import { IRestaurantsRepository } from '../repositories/IRestaurantsRepository';
import { IWorkSchedulesRepository } from '../repositories/IWorkSchedulesRepository';
import { checkIfTheWorkingSchedulesAreValid } from '../utils/checkIfTheWorkingSchedulesAreValid';
import { createAddressesIfItDoesNotExist } from '../utils/createAddressesIfItDoesNotExist';

interface IRequest {
  name: string;
  addresses: {
    postalCode: string;
    number: string;
  }[];
  workSchedules?: {
    sunday?: IWeekDayHours;
    monday?: IWeekDayHours;
    tuesday?: IWeekDayHours;
    wednesday?: IWeekDayHours;
    thursday?: IWeekDayHours;
    friday?: IWeekDayHours;
    saturday?: IWeekDayHours;
  };
}

@injectable()
export class CreateRestaurantService {
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

    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  public async execute({
    name,
    addresses: inputAddresses,
    workSchedules,
  }: IRequest): Promise<IRestaurant> {
    if (workSchedules) {
      const { status, message } = checkIfTheWorkingSchedulesAreValid(
        workSchedules,
        this.dateProvider,
      );

      if (status === 'invalid') {
        throw new AppError(message, 400);
      }
    }

    const restaurant = await this.restaurantsRepository.create({ name });

    const addresses = await createAddressesIfItDoesNotExist(
      inputAddresses,
      this.addressesRepository,
      this.AddressProvider,
    );

    const restaurantAddresses =
      await this.restaurantAddressesRepository.createMany({
        restaurantId: restaurant.id,
        addresses,
      });

    const restaurantWorkSchedules = await this.workSchedulesRepository.create({
      restaurantId: restaurant.id,
      workSchedules,
    });

    const formattedRestaurant: IRestaurant = {
      ...restaurant,
      workSchedules: restaurantWorkSchedules,
      addresses: restaurantAddresses,
    };

    await this.cacheProvider.invalidatePrefix('restaurant-list');

    return formattedRestaurant;
  }
}
