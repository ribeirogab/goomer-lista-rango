import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';

import { FakeStorageProvider } from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import { FakeCategoriesRepository } from '@modules/products/repositories/fakes/FakeCategoriesRepository';
import { FakeProductsRepository } from '@modules/products/repositories/fakes/FakeProductsRepository';
import { FakePromotionsRepository } from '@modules/products/repositories/fakes/FakePromotionsRepository';
import { UpdateProductImage } from '@modules/products/services/UpdateProductImage';

let fakeStorageProvider: FakeStorageProvider;

let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakePromotionsRepository: FakePromotionsRepository;
let restaurantId: string;

let updateProductImage: UpdateProductImage;

describe('UpdateProductImage', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakePromotionsRepository = new FakePromotionsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeProductsRepository = new FakeProductsRepository(
      fakePromotionsRepository,
      fakeCategoriesRepository,
    );

    updateProductImage = new UpdateProductImage(
      fakeProductsRepository,
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

    const updatedProduct = await updateProductImage.execute({
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

    await updateProductImage.execute({
      restaurantId,
      productId: product.id,
      imageFilename: 'marmita.jpg',
    });

    await updateProductImage.execute({
      restaurantId,
      productId: product.id,
      imageFilename: 'marmita-2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('marmita.jpg');
  });

  it('should not be able to update image from non existing product (or wrong id)', async () => {
    await expect(
      updateProductImage.execute({
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
      updateProductImage.execute({
        restaurantId,
        productId: product.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
