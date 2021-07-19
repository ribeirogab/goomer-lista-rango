import 'reflect-metadata';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { FakePaginationProvider } from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import { FakeCategoriesRepository } from '@modules/products/repositories/fakes/FakeCategoriesRepository';
import { FakeProductsRepository } from '@modules/products/repositories/fakes/FakeProductsRepository';
import { FakePromotionsRepository } from '@modules/products/repositories/fakes/FakePromotionsRepository';
import { ListAllProductsByRestaurantIdService } from '@modules/products/services/ListAllProductsByRestaurantIdService';

let fakeCacheProvider: FakeCacheProvider;
let fakePaginationProvider: FakePaginationProvider;

let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakePromotionsRepository: FakePromotionsRepository;
let listAllProductsByRestaurantIdService: ListAllProductsByRestaurantIdService;

describe('ListAllProductsByRestaurantIdService', () => {
  beforeEach(() => {
    fakePromotionsRepository = new FakePromotionsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeProductsRepository = new FakeProductsRepository(
      fakePromotionsRepository,
      fakeCategoriesRepository,
    );
    fakeCacheProvider = new FakeCacheProvider();
    fakePaginationProvider = new FakePaginationProvider();

    listAllProductsByRestaurantIdService =
      new ListAllProductsByRestaurantIdService(
        fakeProductsRepository,
        fakeCacheProvider,
        fakePaginationProvider,
      );
  });

  it('should be able to list all products of restaurant', async () => {
    const restaurantId = 'any-id-for-test';

    await fakeProductsRepository.create({
      restaurantId,
      categoryId: 'any-id',
      name: 'Milk Shake',
      price: 6.99,
    });

    await fakeProductsRepository.create({
      restaurantId,
      categoryId: 'any-id',
      name: 'Sorvete',
      price: 1.5,
    });

    const { pageInfo, products } =
      await listAllProductsByRestaurantIdService.execute({
        restaurantId,
      });

    expect(pageInfo.total).toBe(2);
    expect(products[0].name).toBe('Milk Shake');
    expect(products[0].price).toBe(6.99);
    expect(products[1].name).toBe('Sorvete');
    expect(products[1].price).toBe(1.5);
  });
});
