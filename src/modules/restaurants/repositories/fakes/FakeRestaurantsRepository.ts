import { v4 as uuid } from 'uuid';

import { IRestaurant } from '@modules/restaurants/models/IRestaurant';

import { IFindAllRestaurantsDTO } from '../dtos/IFindAllRestaurantsDTO';
import { IUpdateRestaurantByIdDTO } from '../dtos/IUpdateRestaurantByIdDTO';
import { IRestaurantsRepository } from '../IRestaurantsRepository';
import { FakeRestaurantAddressesRepository } from './FakeRestaurantAddressesRepository';
import { FakeWorkSchedulesRepository } from './FakeWorkSchedulesRepository';

type RestaurantEntity = {
  id: string;
  name: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface IRelations {
  workSchedules: FakeWorkSchedulesRepository;
  restaurantAddresses: FakeRestaurantAddressesRepository;
}

export class FakeRestaurantsRepository implements IRestaurantsRepository {
  private restaurants: RestaurantEntity[];
  private relations: IRelations;

  constructor(
    workSchedulesRepository: FakeWorkSchedulesRepository,
    restaurantAddressesRepository: FakeRestaurantAddressesRepository,
  ) {
    this.restaurants = [];
    this.relations = {
      workSchedules: workSchedulesRepository,
      restaurantAddresses: restaurantAddressesRepository,
    };
  }

  public async create({
    name,
  }: {
    name: string;
  }): Promise<Omit<IRestaurant, 'addresses' | 'workSchedules'>> {
    const restaurant: RestaurantEntity = {
      id: uuid(),
      name,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.restaurants.push(restaurant);

    const restaurantWithImageUrl: Omit<
      IRestaurant,
      'addresses' | 'workSchedules'
    > = {
      ...restaurant,
      imageUrl: null,
    };

    return restaurantWithImageUrl;
  }

  public async findAll({ page, perPage }: IFindAllRestaurantsDTO): Promise<{
    count: number;
    restaurants: IRestaurant[];
  }> {
    const restaurantsPage = this.restaurants.slice(
      (page - 1) * perPage,
      page * perPage,
    );

    const restaurantsPromises = restaurantsPage.map(async restaurant => {
      const restaurantWorkSchedules =
        await this.relations.workSchedules.findByRestaurant({
          restaurantId: restaurant.id,
        });

      const restaurantAddresses =
        await this.relations.restaurantAddresses.findByRestaurantId(
          restaurant.id,
        );

      const formattedRestaurant: IRestaurant = {
        ...restaurant,
        imageUrl: null,
        workSchedules: restaurantWorkSchedules,
        addresses: restaurantAddresses,
      };

      return formattedRestaurant;
    });

    const restaurants = await Promise.all(restaurantsPromises);

    return { count: this.restaurants.length, restaurants };
  }

  public async findById(restaurantId: string): Promise<IRestaurant | null> {
    const foundRestaurant = this.restaurants.find(
      restaurant => restaurant.id === restaurantId,
    );

    if (!foundRestaurant) {
      return null;
    }

    const restaurantWorkSchedules =
      await this.relations.workSchedules.findByRestaurant({
        restaurantId: foundRestaurant.id,
      });

    const restaurantAddresses =
      await this.relations.restaurantAddresses.findByRestaurantId(
        foundRestaurant.id,
      );

    const formattedRestaurant: IRestaurant = {
      ...foundRestaurant,
      imageUrl: null,
      workSchedules: restaurantWorkSchedules,
      addresses: restaurantAddresses,
    };

    return formattedRestaurant;
  }

  public async updateById(
    restaurantId: string,
    { name, image }: IUpdateRestaurantByIdDTO,
  ): Promise<IRestaurant> {
    const restaurantIndex = this.restaurants.findIndex(
      restaurant => restaurant.id === restaurantId,
    );

    if (restaurantIndex === -1) {
      throw new Error('Restaurant does not exist.');
    }

    if (name) {
      this.restaurants[restaurantIndex].name = name;
    }

    if (image) {
      this.restaurants[restaurantIndex].image = image;
    }

    const restaurant = (await this.findById(restaurantId)) as IRestaurant;

    return restaurant;
  }

  public async deleteById(restaurantId: string): Promise<void> {
    this.restaurants = this.restaurants.filter(
      restaurant => restaurant.id !== restaurantId,
    );
  }
}
