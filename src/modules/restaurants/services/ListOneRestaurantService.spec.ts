import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import { FakeAddressesRepository } from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import { FakeRestaurantAddressesRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantAddressesRepository';
import { FakeRestaurantsRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import { FakeWorkSchedulesRepository } from '@modules/restaurants/repositories/fakes/FakeWorkSchedulesRepository';
import { ListOneRestaurantService } from '@modules/restaurants/services/ListOneRestaurantService';

let fakeCacheProvider: FakeCacheProvider;

let fakeAddressesRepository: FakeAddressesRepository;
let fakeRestaurantAddressesRepository: FakeRestaurantAddressesRepository;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let fakeWorkSchedulesRepository: FakeWorkSchedulesRepository;

let listOneRestaurantService: ListOneRestaurantService;

describe('ListOneRestaurantService', () => {
  beforeEach(() => {
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

    listOneRestaurantService = new ListOneRestaurantService(
      fakeRestaurantsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list one restaurant by id', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Restaurant',
    });

    const foundRestaurant = await listOneRestaurantService.execute({
      restaurantId: restaurant.id,
    });

    expect(foundRestaurant.id).toBe(restaurant.id);
    expect(foundRestaurant.name).toBe(restaurant.name);
  });

  it("should not be able to list restaurant if it doesn't exist", async () => {
    await expect(
      listOneRestaurantService.execute({
        restaurantId: 'any-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
