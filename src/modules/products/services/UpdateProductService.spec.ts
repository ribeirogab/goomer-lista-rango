import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { FakeDateProvider } from '@shared/container/providers/DateProvider/fakes/FakeDateProvider';

import { FakeCategoriesRepository } from '@modules/products/repositories/fakes/FakeCategoriesRepository';
import { FakeProductsRepository } from '@modules/products/repositories/fakes/FakeProductsRepository';
import { FakePromotionsRepository } from '@modules/products/repositories/fakes/FakePromotionsRepository';
import { UpdateProductService } from '@modules/products/services/UpdateProductService';

let fakeCacheProvider: FakeCacheProvider;
let fakeDateProvider: FakeDateProvider;

let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakePromotionsRepository: FakePromotionsRepository;
let updateProductService: UpdateProductService;

describe('UpdateProductService', () => {
  beforeEach(() => {
    fakePromotionsRepository = new FakePromotionsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeProductsRepository = new FakeProductsRepository(
      fakePromotionsRepository,
      fakeCategoriesRepository,
    );
    fakeCacheProvider = new FakeCacheProvider();
    fakeDateProvider = new FakeDateProvider();

    updateProductService = new UpdateProductService(
      fakeProductsRepository,
      fakeCategoriesRepository,
      fakePromotionsRepository,
      fakeCacheProvider,
      fakeDateProvider,
    );
  });

  it('should be able to update product', async () => {
    const restaurantId = 'any-id-for-test';

    const oldProduct = await fakeProductsRepository.create({
      restaurantId,
      categoryId: 'any-id',
      name: 'Coxinha de Frango',
      price: 1.99,
    });

    const newProductName = 'Coxinha de Carne';

    const productUpdated = await updateProductService.execute({
      restaurantId,
      productId: oldProduct.id,
      name: newProductName,
    });

    expect(productUpdated.id).toBe(oldProduct.id);
    expect(productUpdated.name).toBe(newProductName);
  });

  it('should be able to update category product', async () => {
    const restaurantId = 'any-id-for-test';

    const categoryOne = await fakeCategoriesRepository.create({
      restaurantId,
      name: 'Salgados',
    });

    const categoryTwo = await fakeCategoriesRepository.create({
      restaurantId,
      name: 'Massas',
    });

    const oldProduct = await fakeProductsRepository.create({
      restaurantId,
      categoryId: categoryOne.id,
      name: 'Pizza de Calabresa',
      price: 39.9,
    });

    const productUpdated = await updateProductService.execute({
      restaurantId,
      productId: oldProduct.id,
      category: categoryTwo.name,
    });

    expect(productUpdated.id).toBe(oldProduct.id);
    expect(productUpdated.category?.id).toBe(categoryTwo.id);
    expect(productUpdated.category?.name).toBe(categoryTwo.name);
  });

  it('should be able to update the product category with a category not yet created', async () => {
    const restaurantId = 'any-id-for-test';

    const category = await fakeCategoriesRepository.create({
      restaurantId,
      name: 'Salgados',
    });

    const oldProduct = await fakeProductsRepository.create({
      restaurantId,
      categoryId: category.id,
      name: 'Pizza de Calabresa',
      price: 39.9,
    });

    const productUpdated = await updateProductService.execute({
      restaurantId,
      productId: oldProduct.id,
      category: 'Massas',
    });

    expect(productUpdated.id).toBe(oldProduct.id);
    expect(productUpdated.category?.name).toBe('Massas');
  });

  it('should be able to update product promotion', async () => {
    const restaurantId = 'any-id-for-test';

    const oldProduct = await fakeProductsRepository.create({
      restaurantId,
      categoryId: 'any-id',
      name: 'Pizza de Calabresa',
      price: 39.9,
    });

    const promotion = {
      description: 'Pizza de calabresa pela metade do dobro!',
      price: 39.9,
      startDatetime: new Date(2021, 6, 17, 20, 0, 0),
      finishDatetime: new Date(2021, 6, 23, 23, 0, 0),
    };

    const productUpdated = await updateProductService.execute({
      restaurantId,
      productId: oldProduct.id,
      category: 'Massas',
      promotion,
    });

    expect(productUpdated.id).toBe(oldProduct.id);
    expect(productUpdated.promotion?.price).toBe(promotion.price);
    expect(productUpdated.promotion?.startsAt.datetime).toEqual(
      promotion.startDatetime,
    );
    expect(productUpdated.promotion?.finishAt.datetime).toEqual(
      promotion.finishDatetime,
    );
  });

  it('should not be able to create a new product with invalid promotion (end promotion time must be later than start promotion time)', async () => {
    const restaurantId = 'any-id-for-test';

    const category = await fakeCategoriesRepository.create({
      restaurantId,
      name: 'Salgados',
    });

    const product = await fakeProductsRepository.create({
      restaurantId,
      categoryId: category.id,
      name: 'Pizza de Calabresa',
      price: 39.9,
    });

    const promotion = {
      price: 0.99,
      description: 'Coxinha pela metade do pre??o!',
      startDatetime: new Date(2021, 6, 23, 12, 30, 0), // start promotion time greater than finish promotion time
      finishDatetime: new Date(2021, 6, 23, 12, 0, 0),
    };

    await expect(
      updateProductService.execute({
        restaurantId,
        productId: product.id,
        promotion,
      }),
    ).rejects.toEqual(
      new AppError(
        'End promotion time must be later than start promotion time',
        400,
      ),
    );
  });

  it('should not be able to create a new product with invalid promotion (intervals between promotion times must be at least 15 minutes)', async () => {
    const restaurantId = 'any-id-for-test';

    const category = await fakeCategoriesRepository.create({
      restaurantId,
      name: 'Salgados',
    });

    const product = await fakeProductsRepository.create({
      restaurantId,
      categoryId: category.id,
      name: 'Pizza de Calabresa',
      price: 39.9,
    });

    const promotion = {
      price: 0.99,
      description: 'Coxinha pela metade do pre??o!',
      startDatetime: new Date(2021, 6, 23, 12, 0, 0), // interval between startDatetime and finishDatetime less than 15 minutes
      finishDatetime: new Date(2021, 6, 23, 12, 14, 0),
    };

    await expect(
      updateProductService.execute({
        restaurantId,
        productId: product.id,
        promotion,
      }),
    ).rejects.toEqual(
      new AppError(
        'Intervals between promotion times must be at least 15 minutes',
        400,
      ),
    );
  });

  it("should not be able to update product if it doesn't exist", async () => {
    await expect(
      updateProductService.execute({
        restaurantId: 'any-id-for-test',
        productId: 'any-id',
        category: 'Massas',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
