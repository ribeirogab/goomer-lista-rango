import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import { FakeAddressesRepository } from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import { FakeCategoriesRepository } from '@modules/products/repositories/fakes/FakeCategoriesRepository';
import { FakeProductsRepository } from '@modules/products/repositories/fakes/FakeProductsRepository';
import { FakePromotionsRepository } from '@modules/products/repositories/fakes/FakePromotionsRepository';
import { CreateProductService } from '@modules/products/services/CreateProductService';
import { FakeRestaurantAddressesRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantAddressesRepository';
import { FakeRestaurantsRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import { FakeWorkSchedulesRepository } from '@modules/restaurants/repositories/fakes/FakeWorkSchedulesRepository';

let fakeCacheProvider: FakeCacheProvider;

let fakeAddressesRepository: FakeAddressesRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakePromotionsRepository: FakePromotionsRepository;
let fakeRestaurantAddressesRepository: FakeRestaurantAddressesRepository;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let fakeWorkSchedulesRepository: FakeWorkSchedulesRepository;
let createProductService: CreateProductService;

describe('CreateProductService', () => {
  beforeEach(() => {
    fakePromotionsRepository = new FakePromotionsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeProductsRepository = new FakeProductsRepository(
      fakePromotionsRepository,
      fakeCategoriesRepository,
    );

    fakeAddressesRepository = new FakeAddressesRepository();
    fakeWorkSchedulesRepository = new FakeWorkSchedulesRepository();
    fakeRestaurantAddressesRepository = new FakeRestaurantAddressesRepository(
      fakeAddressesRepository,
    );
    fakeRestaurantsRepository = new FakeRestaurantsRepository(
      fakeWorkSchedulesRepository,
      fakeRestaurantAddressesRepository,
    );

    fakeCacheProvider = new FakeCacheProvider();

    createProductService = new CreateProductService(
      fakeRestaurantsRepository,
      fakeProductsRepository,
      fakeCategoriesRepository,
      fakePromotionsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new product', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Lista Rango',
    });

    const product = await createProductService.execute({
      restaurantId: restaurant.id,
      category: 'Salgados',
      name: 'Coxinha de Frango',
      price: 1.99,
    });

    expect(product).toHaveProperty('id');
    expect(product.category?.name).toBe('Salgados');
    expect(product.price).toBe(1.99);
  });

  it('should be able to create a new product with promotion', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Lista Rango',
    });

    const promotion = {
      price: 0.99,
      description: 'Coxinha pela metade do preço!',
      startDatetime: new Date(2021, 6, 17, 20, 0, 0),
      finishDatetime: new Date(2021, 6, 23, 12, 30, 0),
    };

    const product = await createProductService.execute({
      restaurantId: restaurant.id,
      category: 'Salgados',
      name: 'Coxinha de Frango',
      price: 2.0,
      promotion,
    });

    expect(product).toHaveProperty('id');
    expect(product.category?.name).toBe('Salgados');
    expect(product.price).toBe(2.0);
    expect(product.promotion?.price).toBe(promotion.price);
    expect(product.promotion?.description).toBe(promotion.description);
  });

  it('should not be able to create a new product if restaurant does not exists', async () => {
    await expect(
      createProductService.execute({
        restaurantId: 'any-id',
        category: 'Salgados',
        name: 'Coxinha de Frango',
        price: 2.0,
        promotion: {
          price: 0.99,
          description: 'Coxinha pela metade do preço!',
          startDatetime: new Date(2021, 6, 17, 20, 0, 0),
          finishDatetime: new Date(2021, 6, 23, 12, 30, 0),
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
