import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import { IProduct } from '../models/IProduct';
import { IProductsRepository } from '../repositories/IProductsRepository';

interface IRequest {
  productId: string;
  restaurantId: string;
  imageFilename?: string;
}

@injectable()
export class UpdateProductImage {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute({
    productId,
    restaurantId,
    imageFilename,
  }: IRequest): Promise<IProduct> {
    if (!imageFilename) {
      throw new AppError('Invalide file.', 400);
    }

    const product = await this.productsRepository.findOne({
      restaurantId,
      productId,
    });

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    if (product.image) {
      await this.storageProvider.deleteFile(product.image);
    }

    const filename = await this.storageProvider.saveFile(imageFilename);

    const updatedProduct = (await this.productsRepository.update({
      productId,
      restaurantId,
      image: filename,
    })) as IProduct;

    await this.cacheProvider.invalidatePrefix('product-list');
    await this.cacheProvider.invalidatePrefix('', `product:*,${productId}`);

    return updatedProduct;
  }
}
