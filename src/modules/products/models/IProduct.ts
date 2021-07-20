import { ICategory } from './ICategory';
import { IPromotion } from './IPromotion';

export interface IProduct {
  id: string;
  name: string;
  image: string | null;
  imageUrl: string | null;
  price: number;

  // relations
  category: ICategory | null;
  promotion: IPromotion | null;

  createdAt: Date;
  updatedAt: Date;
}
