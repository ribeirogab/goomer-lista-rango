import 'reflect-metadata';

import { FakeAddressProvider } from '@shared/container/providers/AddressProvider/fakes/FakeAddressProvider';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import { FakeAddressesRepository } from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import { FakeRestaurantAddressesRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantAddressesRepository';
import { FakeRestaurantsRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import { FakeWorkSchedulesRepository } from '@modules/restaurants/repositories/fakes/FakeWorkSchedulesRepository';
import { CreateRestaurantService } from '@modules/restaurants/services/CreateRestaurantService';

let fakeCacheProvider: FakeCacheProvider;
let fakeAddressProvider: FakeAddressProvider;

let fakeAddressesRepository: FakeAddressesRepository;
let fakeRestaurantAddressesRepository: FakeRestaurantAddressesRepository;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let fakeWorkSchedulesRepository: FakeWorkSchedulesRepository;

let createRestaurantService: CreateRestaurantService;

describe('CreateRestaurantService', () => {
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
    fakeAddressProvider = new FakeAddressProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createRestaurantService = new CreateRestaurantService(
      fakeRestaurantsRepository,
      fakeAddressesRepository,
      fakeRestaurantAddressesRepository,
      fakeWorkSchedulesRepository,
      fakeAddressProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new restaurant', async () => {
    const restaurant = await createRestaurantService.execute({
      name: 'Goomer Restaurant',
      addresses: [
        {
          postalCode: '18279350',
          number: '99',
        },
      ],
      workSchedules: {
        monday: {
          startHour: '08:00',
          finishHour: '10:00',
        },
      },
    });

    expect(restaurant).toHaveProperty('id');
    expect(restaurant.name).toBe('Goomer Restaurant');
    expect(restaurant.addresses[0].postalCode).toBe('18279350');
    expect(restaurant.addresses[0].number).toBe('99');
    expect(restaurant.workSchedules).toHaveProperty('sunday');
    expect(restaurant.workSchedules).toHaveProperty('monday');
    expect(restaurant.workSchedules).toHaveProperty('tuesday');
    expect(restaurant.workSchedules).toHaveProperty('wednesday');
    expect(restaurant.workSchedules).toHaveProperty('thursday');
    expect(restaurant.workSchedules).toHaveProperty('friday');
    expect(restaurant.workSchedules).toHaveProperty('saturday');
    expect(restaurant.workSchedules?.monday).toStrictEqual({
      startHour: '08:00',
      finishHour: '10:00',
    });
  });
});
