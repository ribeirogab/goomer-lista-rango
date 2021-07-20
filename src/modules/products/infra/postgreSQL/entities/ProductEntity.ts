import { IProduct } from '@modules/products/models/IProduct';

import { CategoryEntity } from './CategoryEntity';
import { PromotionEntity } from './PromotionEntity';

interface IRelations {
  promotions: typeof PromotionEntity;
  categories: typeof CategoryEntity;
}

export class ProductEntity {
  public static table = 'products';
  public static relations: IRelations = {
    promotions: PromotionEntity,
    categories: CategoryEntity,
  };
  public static baseImageUrl = process.env.STORAGE_BASE_URL || '';

  public id: string;
  public restaurant_id: string;
  public category_id: string | null;
  public name: string;
  public image: string | null;
  public price: number;

  public created_at: Date;
  public updated_at: Date;

  public static setImageUrl(image: string | null): string | null {
    return image ? `${this.baseImageUrl}${image}` : null;
  }

  public static formatProduct(
    product: ProductEntity,
  ): Omit<IProduct, 'category' | 'promotion'> {
    const formattedProduct: Omit<IProduct, 'category' | 'promotion'> = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      imageUrl: this.setImageUrl(product.image),
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };

    return formattedProduct;
  }
}
