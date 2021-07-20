import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { ProductsController } from '../controllers/ProductsController';

const productsRouter = Router();
const productsController = new ProductsController();

const promotionValidation = Joi.object().keys({
  description: Joi.string(),
  price: Joi.number().required(),
  startDatetime: Joi.date().required(),
  finishDatetime: Joi.date().required(),
});

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
      promotion: promotionValidation,
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
    [Segments.BODY]: Joi.object()
      .keys({
        name: Joi.string(),
        price: Joi.number(),
        category: Joi.string(),
        promotion: promotionValidation,
      })
      .min(1),
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
