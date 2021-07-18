import { IRestaurant } from '@modules/restaurants/models/IRestaurant';

import { RestaurantAddressEntity } from './RestaurantAddressEntity';
import { WorkScheduleEntity } from './WorkScheduleEntity';

type RestaurantWithoutRelations = Omit<
  IRestaurant,
  'addresses' | 'workSchedules'
>;

interface IRelations {
  restaurantAddresses: typeof RestaurantAddressEntity;
  workSchedules: typeof WorkScheduleEntity;
}

export class RestaurantEntity {
  public static table = 'restaurants';
  public static relations: IRelations = {
    restaurantAddresses: RestaurantAddressEntity,
    workSchedules: WorkScheduleEntity,
  };
  public static baseImageUrl = 'http://localhost:3333';

  public id: string;
  public name: string;
  public image: string | null;

  public created_at: Date;
  public updated_at: Date;

  private static setImageUrl(image: string | null): string | null {
    return image ? `${this.baseImageUrl}/${image}` : null;
  }

  public static formatRestaurant(
    restaurant: RestaurantEntity,
  ): RestaurantWithoutRelations {
    const formattedRestaurant: RestaurantWithoutRelations = {
      id: restaurant.id,
      name: restaurant.name,
      image: restaurant.image,
      imageUrl: this.setImageUrl(restaurant.image),
      createdAt: restaurant.created_at,
      updatedAt: restaurant.updated_at,
    };

    return formattedRestaurant;
  }
}
