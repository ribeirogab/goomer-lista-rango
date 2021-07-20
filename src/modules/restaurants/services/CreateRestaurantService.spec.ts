import 'reflect-metadata';

import { AppError } from '@shared/errors/AppError';

import { FakeAddressProvider } from '@shared/container/providers/AddressProvider/fakes/FakeAddressProvider';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { FakeDateProvider } from '@shared/container/providers/DateProvider/fakes/FakeDateProvider';

import { FakeAddressesRepository } from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import { FakeRestaurantAddressesRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantAddressesRepository';
import { FakeRestaurantsRepository } from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import { FakeWorkSchedulesRepository } from '@modules/restaurants/repositories/fakes/FakeWorkSchedulesRepository';
import { CreateRestaurantService } from '@modules/restaurants/services/CreateRestaurantService';

let fakeCacheProvider: FakeCacheProvider;
let fakeAddressProvider: FakeAddressProvider;
let fakeDateProvider: FakeDateProvider;

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
    fakeDateProvider = new FakeDateProvider();

    createRestaurantService = new CreateRestaurantService(
      fakeRestaurantsRepository,
      fakeAddressesRepository,
      fakeRestaurantAddressesRepository,
      fakeWorkSchedulesRepository,
      fakeAddressProvider,
      fakeCacheProvider,
      fakeDateProvider,
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

  it('should not be able to create a new restaurant with invalid work schedules (end time must be later than start time)', async () => {
    await expect(
      createRestaurantService.execute({
        name: 'Goomer Restaurant',
        addresses: [
          {
            postalCode: '18279350',
            number: '99',
          },
        ],
        workSchedules: {
          monday: {
            startHour: '10:00', // start time greater than finish time
            finishHour: '09:00',
          },
        },
      }),
    ).rejects.toEqual(
      new AppError(
        'End time must be later than start time in the field "monday.startHour"',
        400,
      ),
    );
  });

  it('should not be able to create a new restaurant with invalid work schedules (the intervals between times must be at least 15 minutes)', async () => {
    await expect(
      createRestaurantService.execute({
        name: 'Goomer Restaurant',
        addresses: [
          {
            postalCode: '18279350',
            number: '99',
          },
        ],
        workSchedules: {
          monday: {
            startHour: '09:45', // interval between startHour and finishHour less than 15 minutes
            finishHour: '09:59',
          },
        },
      }),
    ).rejects.toEqual(
      new AppError(
        'The intervals between times must be at least 15 minutes in the field "monday.startHour"',
        400,
      ),
    );
  });
});
