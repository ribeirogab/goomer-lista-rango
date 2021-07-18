import { inject, injectable } from 'tsyringe';

import { IProduct } from '@modules/products/models/IProduct';

import { ICategoriesRepository } from '../repositories/ICategoriesRepository';
import { IProductsRepository } from '../repositories/IProductsRepository';
import { IPromotionsRepository } from '../repositories/IPromotionsRepository';

type Promotion = {
  description?: string;
  price: number;
  startDatetime: Date;
  finishDatetime: Date;
};

interface IRequest {
  restaurantId: string;
  productId: string;
  name?: string;
  category?: string;
  price?: number;
  promotion?: Promotion;
}

@injectable()
export class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('PromotionsRepository')
    private promotionsRepository: IPromotionsRepository,
  ) {}

  public async execute({
    restaurantId,
    productId,
    name,
    category: categoryName,
    price,
    promotion,
  }: IRequest): Promise<IProduct> {
    let categoryId: string | null = null;

    if (categoryName) {
      let category = await this.categoriesRepository.findByName({
        restaurantId,
        categoryName,
      });

      if (!category) {
        category = await this.categoriesRepository.create({
          restaurantId,
          name: categoryName,
        });
      }

      categoryId = category.id;
    }

    if (promotion) {
      await this.promotionsRepository.updateByProductId({
        productId,
        ...promotion,
      });
    }

    const updatedProduct = await this.productsRepository.update({
      restaurantId,
      productId,
      name,
      price,
      ...(categoryId ? { categoryId } : {}),
    });

    return updatedProduct;
  }
}
