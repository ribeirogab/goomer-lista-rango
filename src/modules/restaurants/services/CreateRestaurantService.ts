import { inject, injectable } from 'tsyringe';

import { IAddress } from '@modules/addresses/models/IAddress';
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

    @inject('WorkSchedulesRepository')
    private workSchedulesRepository: IWorkSchedulesRepository,

    @inject('RestaurantAddressesRepository')
    private restaurantAddressesRepository: IRestaurantAddressesRepository,

    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute({
    name,
    addresses: inputAddresses,
    workSchedules,
  }: IRequest): Promise<IRestaurant> {
    const restaurant = await this.restaurantsRepository.create({ name });

    const addressesPromises = inputAddresses.map(async inputAddress => {
      let address = await this.addressesRepository.findByPostalCode(
        inputAddress.postalCode,
      );

      if (!address) {
        address = {
          postalCode: '',
          state: '',
          city: '',
          neighborhood: '',
          street: '',
          country: '',
          countryCode: '',
        } as IAddress;
      }

      return { postalCode: address?.postalCode, number: inputAddress.number };
    });

    const addresses = await Promise.all(addressesPromises);

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
