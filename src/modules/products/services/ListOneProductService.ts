import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { IProduct } from '../models/IProduct';
import { IProductsRepository } from '../repositories/IProductsRepository';

interface IRequest {
  restaurantId: string;
  productId: string;
}

@injectable()
export class ListOneProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    restaurantId,
    productId,
  }: IRequest): Promise<IProduct> {
    const cacheKey = this.cacheProvider.createKey({
      prefix: 'product',
      params: [restaurantId, productId],
    });

    const cacheData = await this.cacheProvider.recover<IProduct>(cacheKey);

    if (cacheData) {
      return cacheData;
    }
    const product = await this.productsRepository.findOne({
      restaurantId,
      productId,
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await this.cacheProvider.save(cacheKey, product);

    return product;
  }
}
