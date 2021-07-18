import { inject, injectable } from 'tsyringe';

import { IAddressProvider } from '@shared/container/providers/AddressProvider/models/IAddressProvider';

import { IAddressesRepository } from '@modules/addresses/repositories/IAddressesRepository';

import { IRestaurant } from '../models/IRestaurant';
import { IWeekDayHours } from '../models/IWorkSchedule';
import { IRestaurantAddressesRepository } from '../repositories/IRestaurantAddressesRepository';
import { IRestaurantsRepository } from '../repositories/IRestaurantsRepository';
import { IWorkSchedulesRepository } from '../repositories/IWorkSchedulesRepository';

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
  ) {}

  public async execute({
    name,
    addresses: inputAddresses,
    workSchedules,
  }: IRequest): Promise<IRestaurant> {
    const restaurant = await this.restaurantsRepository.create({ name });

    const addresses =
      await this.AddressProvider.createAddressesIfItDoesNotExist({
        addresses: inputAddresses,
        addressesRepository: this.addressesRepository,
      });

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

    return formattedRestaurant;
  }
}
