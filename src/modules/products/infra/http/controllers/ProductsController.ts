import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateProductService } from '@modules/products/services/CreateProductService';
import { DeleteProductService } from '@modules/products/services/DeleteProductService';
import { ListAllProductsByRestaurantIdService } from '@modules/products/services/ListAllProductsByRestaurantIdService';
import { ListOneProductService } from '@modules/products/services/ListOneProductService';
import { UpdateProductService } from '@modules/products/services/UpdateProductService';

export class ProductsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { restaurantId } = req.params;
    const { name, price, category, promotion } = req.body;

    const createProductService = container.resolve(CreateProductService);

    const product = await createProductService.execute({
      restaurantId,
      name,
      price,
      category,
      promotion,
    });

    return res.json({ product });
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { restaurantId } = req.params;
    const { page, perPage } = req.query;

    const listAllProductsByRestaurantIdService = container.resolve(
      ListAllProductsByRestaurantIdService,
    );

    const { pageInfo, products } =
      await listAllProductsByRestaurantIdService.execute({
        restaurantId,
        page: page as number | undefined,
        perPage: perPage as number | undefined,
      });

    return res.json({ pageInfo, products });
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { restaurantId, productId } = req.params;

    const listOneProductService = container.resolve(ListOneProductService);

    const product = await listOneProductService.execute({
      restaurantId,
      productId,
    });

    return res.json({ product });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { restaurantId, productId } = req.params;
    const { name, price, category, promotion } = req.body;

    const updateProductService = container.resolve(UpdateProductService);

    const product = await updateProductService.execute({
      restaurantId,
      productId,
      name,
      price,
      category,
      promotion,
    });

    return res.json({ product });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { restaurantId, productId } = req.params;

    const deleteProductService = container.resolve(DeleteProductService);

    await deleteProductService.execute({
      restaurantId,
      productId,
    });

    return res.status(204).send();
  }
}
