import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

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

    @inject('WorkSchedulesRepository')
    private workSchedulesRepository: IWorkSchedulesRepository,

    @inject('RestaurantAddressesRepository')
    private restaurantAddressesRepository: IRestaurantAddressesRepository,

    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
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
      throw new AppError(
        'Restaurant does not exist.',
        400,
        'restaurant.update.restaurant.not.exist',
      );
    }

    if (inputAddresses) {
      const addressesPromises = inputAddresses.map(async inputAddress => {
        let address = await this.addressesRepository.findByPostalCode(
          inputAddress.postalCode,
        );

        if (!address) {
          address = await this.addressesRepository.create({
            postalCode: inputAddress.postalCode,
            state: '',
            city: '',
            neighborhood: '',
            street: '',
            country: '',
            countryCode: '',
          });
        }

        return { postalCode: address.postalCode, number: inputAddress.number };
      });

      const addresses = await Promise.all(addressesPromises);

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

    const updatedRestaurant = await this.restaurantsRepository.updateById(
      restaurantId,
      { name },
    );

    return updatedRestaurant;
  }
}
