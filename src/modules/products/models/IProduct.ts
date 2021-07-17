import { ICategory } from './ICategory';

export interface IProduct {
  id: string;
  name: string;
  image: string | null;
  imageUrl: string | null;
  price: number;

  // relations
  category: ICategory;

  createdAt: Date;
  updatedAt: Date;
}
