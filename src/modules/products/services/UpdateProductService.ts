import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    restaurantId,
    productId,
    name,
    category: categoryName,
    price,
    promotion,
  }: IRequest): Promise<IProduct> {
    const productExists = await this.productsRepository.findOne({
      restaurantId,
      productId,
    });

    if (!productExists) {
      throw new AppError('Product does not exist.', 400);
    }

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

    const updatedProduct = (await this.productsRepository.update({
      restaurantId,
      productId,
      name,
      price,
      ...(categoryId ? { categoryId } : {}),
    })) as IProduct;

    await this.cacheProvider.invalidatePrefix('product-list');
    await this.cacheProvider.invalidatePrefix('', `product:*,${productId}`);

    return updatedProduct;
  }
}
