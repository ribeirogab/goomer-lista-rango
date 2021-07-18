import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { IRestaurantsRepository } from '@modules/restaurants/repositories/IRestaurantsRepository';

import { IProduct } from '../models/IProduct';
import { IPromotion } from '../models/IPromotion';
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
  name: string;
  category: string;
  price: number;
  promotion?: Promotion;
}

@injectable()
export class CreateProductService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('PromotionsRepository')
    private promotionsRepository: IPromotionsRepository,
  ) {}

  public async execute({
    restaurantId,
    name,
    category: categoryName,
    price,
    promotion: inputPromotion,
  }: IRequest): Promise<IProduct> {
    const restaurantExists = await this.restaurantsRepository.findById(
      restaurantId,
    );

    if (!restaurantExists) {
      throw new AppError('Restaurant does not exist.', 400);
    }

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

    const product = await this.productsRepository.create({
      restaurantId,
      categoryId: category.id,
      name,
      price,
    });

    let promotion: IPromotion | null = null;

    if (inputPromotion) {
      promotion = await this.promotionsRepository.create({
        ...inputPromotion,
        productId: product.id,
      });
    }

    const formattedProduct = {
      ...product,
      category,
      promotion,
    };

    return formattedProduct;
  }
}
