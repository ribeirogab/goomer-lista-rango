import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { RestaurantsController } from '../controllers/RestaurantsController';

const restaurantsRouter = Router();
const restaurantsController = new RestaurantsController();

const weekDayScheduleValidation = Joi.object().keys({
  startHour: Joi.string().required(),
  finishHour: Joi.string().required(),
});

const arrayUniqueAddressValidation = Joi.array()
  .items({
    postalCode: Joi.string().required(),
    number: Joi.number().required(),
  })
  .unique((a, b) => a.postalCode === b.postalCode && a.number === b.number)
  .min(1);

restaurantsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      addresses: arrayUniqueAddressValidation.required(),
      workSchedules: Joi.object().keys({
        sunday: weekDayScheduleValidation,
        monday: weekDayScheduleValidation,
        tuesday: weekDayScheduleValidation,
        wednesday: weekDayScheduleValidation,
        thursday: weekDayScheduleValidation,
        friday: weekDayScheduleValidation,
        saturday: weekDayScheduleValidation,
      }),
    },
  }),
  restaurantsController.create,
);

restaurantsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(50),
    },
  }),
  restaurantsController.index,
);

restaurantsRouter.get(
  '/:restaurantId',
  celebrate({
    [Segments.PARAMS]: {
      restaurantId: Joi.string().required(),
    },
  }),
  restaurantsController.show,
);

restaurantsRouter.put(
  '/:restaurantId',
  celebrate({
    [Segments.PARAMS]: {
      restaurantId: Joi.string().required(),
    },
    [Segments.BODY]: {
      name: Joi.string(),
      addresses: Joi.array()
        .items({
          postalCode: Joi.string().required(),
          number: Joi.number().required(),
        })
        .min(1),
      workSchedule: Joi.object().keys({
        sunday: weekDayScheduleValidation,
        monday: weekDayScheduleValidation,
        tuesday: weekDayScheduleValidation,
        wednesday: weekDayScheduleValidation,
        thursday: weekDayScheduleValidation,
        friday: weekDayScheduleValidation,
        saturday: weekDayScheduleValidation,
      }),
    },
  }),
  restaurantsController.update,
);

restaurantsRouter.delete(
  '/:restaurantId',
  celebrate({
    [Segments.PARAMS]: {
      restaurantId: Joi.string().required(),
    },
  }),
  restaurantsController.delete,
);

export { restaurantsRouter };
