import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { ProductsController } from '../controllers/ProductsController';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.post(
  '/:restaurantId',
  celebrate({
    [Segments.PARAMS]: {
      restaurantId: Joi.string().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().required(),
      category: Joi.string().required(),
      promotion: Joi.object().keys({
        description: Joi.string(),
        price: Joi.number().required(),
        startDatetime: Joi.date().required(),
        finishDatetime: Joi.date().required(),
      }),
    },
  }),
  productsController.create,
);

productsRouter.get(
  '/:restaurantId',
  celebrate({
    [Segments.PARAMS]: {
      restaurantId: Joi.string().required(),
    },
    [Segments.QUERY]: {
      page: Joi.number(),
      perPage: Joi.number(),
    },
  }),
  productsController.index,
);

productsRouter.get(
  '/:restaurantId/:productId',
  celebrate({
    [Segments.PARAMS]: {
      restaurantId: Joi.string().required(),
      productId: Joi.string().required(),
    },
  }),
  productsController.show,
);

productsRouter.put(
  '/:restaurantId/:productId',
  celebrate({
    [Segments.PARAMS]: {
      restaurantId: Joi.string().required(),
      productId: Joi.string().required(),
    },
  }),
  productsController.update,
);

productsRouter.delete(
  '/:restaurantId/:productId',
  celebrate({
    [Segments.PARAMS]: {
      restaurantId: Joi.string().required(),
      productId: Joi.string().required(),
    },
  }),
  productsController.delete,
);

export { productsRouter };
