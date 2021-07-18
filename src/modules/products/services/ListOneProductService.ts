import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

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
  ) {}

  public async execute({
    restaurantId,
    productId,
  }: IRequest): Promise<IProduct> {
    const product = await this.productsRepository.findOne({
      restaurantId,
      productId,
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }
}
