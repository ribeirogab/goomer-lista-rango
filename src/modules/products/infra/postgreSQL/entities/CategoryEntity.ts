import { ICategory } from '@modules/products/models/ICategory';

export class CategoryEntity {
  public static table = 'categories';

  public id: string;
  public restaurant_id: string;
  public name: string;

  public created_at: Date;
  public updated_at: Date;

  public static formatCategory(category: CategoryEntity): ICategory {
    const formattedCategory: ICategory = {
      id: category.id,
      name: category.name,
    };

    return formattedCategory;
  }
}
