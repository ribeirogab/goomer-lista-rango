import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { FakePaginationProvider } from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import { FakeAddressesRepository } from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import { FakeCategoriesRepository } from '@modules/products/repositories/fakes/FakeCategoriesRepository';
import { FakeProductsRepository } from '@modules/products/repositories/fakes/FakeProductsRepository';
import { FakePromotionsRepository } from '@modules/products/repositories/fakes/FakePromotionsRepository';
import { ListAllProductsByRestaurantIdService } from '@modules/products/services/ListAllProductsByRestaurantIdService';
import { FakeRestaurantAddressesRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantAddressesRepository';
import { FakeRestaurantsRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import { FakeWorkSchedulesRepository } from '@modules/restaurants/repositories/fakes/FakeWorkSchedulesRepository';

let fakeCacheProvider: FakeCacheProvider;
let fakePaginationProvider: FakePaginationProvider;

let fakeAddressesRepository: FakeAddressesRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakePromotionsRepository: FakePromotionsRepository;
let fakeRestaurantAddressesRepository: FakeRestaurantAddressesRepository;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let fakeWorkSchedulesRepository: FakeWorkSchedulesRepository;

let listAllProductsByRestaurantIdService: ListAllProductsByRestaurantIdService;

describe('ListAllProductsByRestaurantIdService', () => {
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
    fakePaginationProvider = new FakePaginationProvider();

    listAllProductsByRestaurantIdService =
      new ListAllProductsByRestaurantIdService(
        fakeRestaurantsRepository,
        fakeProductsRepository,
        fakeCacheProvider,
        fakePaginationProvider,
      );
  });

  it('should be able to list all products of restaurant', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Lista Rango',
    });

    await fakeProductsRepository.create({
      restaurantId: restaurant.id,
      categoryId: 'any-id',
      name: 'Milk Shake',
      price: 6.99,
    });

    await fakeProductsRepository.create({
      restaurantId: restaurant.id,
      categoryId: 'any-id',
      name: 'Sorvete',
      price: 1.5,
    });

    const { pageInfo, products } =
      await listAllProductsByRestaurantIdService.execute({
        restaurantId: restaurant.id,
      });

    expect(pageInfo.total).toBe(2);
    expect(products[0].name).toBe('Milk Shake');
    expect(products[0].price).toBe(6.99);
    expect(products[1].name).toBe('Sorvete');
    expect(products[1].price).toBe(1.5);
  });

  it('should be able to list all products of restaurant (from cache)', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Lista Rango',
    });

    await fakeProductsRepository.create({
      restaurantId: restaurant.id,
      categoryId: 'any-id',
      name: 'Milk Shake',
      price: 6.99,
    });

    await fakeProductsRepository.create({
      restaurantId: restaurant.id,
      categoryId: 'any-id',
      name: 'Sorvete',
      price: 1.5,
    });

    await listAllProductsByRestaurantIdService.execute({
      restaurantId: restaurant.id,
    });

    const { pageInfo, products } =
      await listAllProductsByRestaurantIdService.execute({
        restaurantId: restaurant.id,
      });

    expect(pageInfo.total).toBe(2);
    expect(products[0].name).toBe('Milk Shake');
    expect(products[0].price).toBe(6.99);
    expect(products[1].name).toBe('Sorvete');
    expect(products[1].price).toBe(1.5);
  });

  it("should not be able to list if restaurant doesn't exist", async () => {
    await expect(
      listAllProductsByRestaurantIdService.execute({
        restaurantId: 'any-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
