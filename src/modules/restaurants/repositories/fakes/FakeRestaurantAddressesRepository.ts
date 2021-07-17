import { FakeAddressesRepository } from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import { IRestaurantAddress } from '@modules/restaurants/models/IRestaurantAddress';

import { ICreateManyRestaurantAddressesDTO } from '../dtos/ICreateManyRestaurantAddressesDTO';
import { IRestaurantAddressesRepository } from '../IRestaurantAddressesRepository';

type RestaurantAddressesEntity = {
  restaurantId: string;
  addressPostalCode: string;
  number: string;
  createdAt: Date;
  updatedAt: Date;
};

interface IRelations {
  addresses: FakeAddressesRepository;
}

export class FakeRestaurantAddressesRepository
  implements IRestaurantAddressesRepository
{
  private restaurantAddresses: RestaurantAddressesEntity[];
  private relations: IRelations;

  constructor(addressesRepository: FakeAddressesRepository) {
    this.restaurantAddresses = [];
    this.relations = {
      addresses: addressesRepository,
    };
  }

  public async createMany({
    restaurantId,
    addresses,
  }: ICreateManyRestaurantAddressesDTO): Promise<IRestaurantAddress[]> {
    const newRestaurantAddresses = addresses.map(address => {
      const restaurantAddress: RestaurantAddressesEntity = {
        restaurantId,
        addressPostalCode: address.postalCode,
        number: address.number,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return restaurantAddress;
    });

    this.restaurantAddresses.push(...newRestaurantAddresses);

    const fullRestaurantAddressesPromises = newRestaurantAddresses.map(
      async restaurantAddress => {
        const fullAddress = await this.relations.addresses.findByPostalCode(
          restaurantAddress.addressPostalCode,
        );

        const fullAddressRestaurant: IRestaurantAddress = {
          postalCode: restaurantAddress.addressPostalCode,
          state: fullAddress?.state || '',
          city: fullAddress?.city || '',
          neighborhood: fullAddress?.neighborhood || '',
          street: fullAddress?.street || '',
          number: restaurantAddress.number,
          country: fullAddress?.country || '',
          countryCode: fullAddress?.countryCode || '',
          createdAt: restaurantAddress.createdAt,
          updatedAt: restaurantAddress.updatedAt,
        };

        return fullAddressRestaurant;
      },
    );

    const fullRestaurantAddresses = await Promise.all(
      fullRestaurantAddressesPromises,
    );

    return fullRestaurantAddresses;
  }

  public async findByRestaurantId(
    restaurantId: string,
  ): Promise<IRestaurantAddress[]> {
    const foundRestaurantAddresses = this.restaurantAddresses.filter(
      restaurantAddress => restaurantAddress.restaurantId === restaurantId,
    );

    const fullRestaurantAddressesPromises = foundRestaurantAddresses.map(
      async restaurantAddress => {
        const fullAddress = await this.relations.addresses.findByPostalCode(
          restaurantAddress.addressPostalCode,
        );

        const fullAddressRestaurant: IRestaurantAddress = {
          postalCode: restaurantAddress.addressPostalCode,
          state: fullAddress?.state || '',
          city: fullAddress?.city || '',
          neighborhood: fullAddress?.neighborhood || '',
          street: fullAddress?.street || '',
          number: restaurantAddress.number,
          country: fullAddress?.country || '',
          countryCode: fullAddress?.countryCode || '',
          createdAt: restaurantAddress.createdAt,
          updatedAt: restaurantAddress.updatedAt,
        };

        return fullAddressRestaurant;
      },
    );

    const fullRestaurantAddresses = await Promise.all(
      fullRestaurantAddressesPromises,
    );

    return fullRestaurantAddresses;
  }
}
