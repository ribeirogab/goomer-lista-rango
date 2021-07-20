import { inject, injectable } from 'tsyringe';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { IProductsRepository } from '../repositories/IProductsRepository';

interface IRequest {
  restaurantId: string;
  productId: string;
}

@injectable()
export class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ restaurantId, productId }: IRequest): Promise<void> {
    await this.productsRepository.delete({ restaurantId, productId });

    await this.cacheProvider.invalidatePrefix('product-list');
    await this.cacheProvider.invalidatePrefix('', `product:*,${productId}`);
  }
}
