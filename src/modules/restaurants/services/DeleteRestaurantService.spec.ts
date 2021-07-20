import 'reflect-metadata';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import { FakeAddressesRepository } from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import { FakeRestaurantAddressesRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantAddressesRepository';
import { FakeRestaurantsRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import { FakeWorkSchedulesRepository } from '@modules/restaurants/repositories/fakes/FakeWorkSchedulesRepository';
import { DeleteRestaurantService } from '@modules/restaurants/services/DeleteRestaurantService';

let fakeCacheProvider: FakeCacheProvider;

let fakeAddressesRepository: FakeAddressesRepository;
let fakeRestaurantAddressesRepository: FakeRestaurantAddressesRepository;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let fakeWorkSchedulesRepository: FakeWorkSchedulesRepository;

let deleteRestaurantService: DeleteRestaurantService;

describe('DeleteRestaurantService', () => {
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

    deleteRestaurantService = new DeleteRestaurantService(
      fakeRestaurantsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a restaurant by id', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      name: 'Goomer Restaurant',
    });

    await expect(
      deleteRestaurantService.execute({ restaurantId: restaurant.id }),
    ).resolves.not.toThrow();
  });
});
