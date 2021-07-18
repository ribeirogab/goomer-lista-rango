import { Router } from 'express';

import { RestaurantsController } from '../controllers/RestaurantsController';

const restaurantsRouter = Router();
const restaurantsController = new RestaurantsController();

restaurantsRouter.post('/', restaurantsController.create);

restaurantsRouter.get('/', restaurantsController.index);

restaurantsRouter.get('/:restaurantId', restaurantsController.show);

restaurantsRouter.put('/:restaurantId', restaurantsController.update);

restaurantsRouter.delete('/:restaurantId', restaurantsController.delete);

export { restaurantsRouter };
