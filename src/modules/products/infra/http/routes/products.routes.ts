import { Router } from 'express';

import { ProductsController } from '../controllers/ProductsController';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.post('/:restaurantId', productsController.create);

productsRouter.get('/:restaurantId', productsController.index);

productsRouter.get('/:restaurantId/:productId', productsController.show);

productsRouter.put('/:restaurantId/:productId', productsController.update);

productsRouter.delete('/:restaurantId/:productId', productsController.delete);

export { productsRouter };
