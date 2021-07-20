import { IRestaurantAddress } from './IRestaurantAddress';
import { IWorkSchedule } from './IWorkSchedule';

export interface IRestaurant {
  id: string;
  name: string;
  image: string | null;
  imageUrl: string | null;

  // relations
  addresses: IRestaurantAddress[];
  workSchedules: IWorkSchedule | null;

  createdAt: Date;
  updatedAt: Date;
}
