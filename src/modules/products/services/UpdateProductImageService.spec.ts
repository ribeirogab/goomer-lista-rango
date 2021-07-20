import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { FakeStorageProvider } from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import { FakeCategoriesRepository } from '@modules/products/repositories/fakes/FakeCategoriesRepository';
import { FakeProductsRepository } from '@modules/products/repositories/fakes/FakeProductsRepository';
import { FakePromotionsRepository } from '@modules/products/repositories/fakes/FakePromotionsRepository';
import { UpdateProductImageService } from '@modules/products/services/UpdateProductImageService';

let fakeCacheProvider: FakeCacheProvider;
let fakeStorageProvider: FakeStorageProvider;

let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakePromotionsRepository: FakePromotionsRepository;
let restaurantId: string;

let updateProductImageService: UpdateProductImageService;

describe('UpdateProductImageService', () => {
  beforeEach(() => {
    fakePromotionsRepository = new FakePromotionsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeProductsRepository = new FakeProductsRepository(
      fakePromotionsRepository,
      fakeCategoriesRepository,
    );
    fakeCacheProvider = new FakeCacheProvider();
    fakeStorageProvider = new FakeStorageProvider();

    updateProductImageService = new UpdateProductImageService(
      fakeProductsRepository,
      fakeCacheProvider,
      fakeStorageProvider,
    );

    restaurantId = 'any-id-for-test';
  });

  it('should be able to update product image', async () => {
    const product = await fakeProductsRepository.create({
      name: 'Goomer Rango',
      price: 13,
      restaurantId,
      categoryId: 'any-id',
    });

    const updatedProduct = await updateProductImageService.execute({
      restaurantId,
      productId: product.id,
      imageFilename: 'marmita.jpg',
    });

    expect(updatedProduct.id).toBe(product.id);
    expect(updatedProduct.image).toBe('marmita.jpg');
  });

  it('should delete old image when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const product = await fakeProductsRepository.create({
      name: 'Goomer Rango',
      price: 13,
      categoryId: 'any-id',
      restaurantId,
    });

    await updateProductImageService.execute({
      restaurantId,
      productId: product.id,
      imageFilename: 'marmita.jpg',
    });

    await updateProductImageService.execute({
      restaurantId,
      productId: product.id,
      imageFilename: 'marmita-2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('marmita.jpg');
  });

  it('should not be able to update image from non existing product (or wrong id)', async () => {
    await expect(
      updateProductImageService.execute({
        restaurantId,
        productId: 'any-id',
        imageFilename: 'marmita.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update image without imageFilename param', async () => {
    const product = await fakeProductsRepository.create({
      name: 'Goomer Rango',
      price: 13,
      categoryId: 'any-id',
      restaurantId: 'any-id',
    });

    await expect(
      updateProductImageService.execute({
        restaurantId,
        productId: product.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
