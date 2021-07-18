import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

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

    return updatedProduct;
  }
}
