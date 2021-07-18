import { v4 as uuid } from 'uuid';

import { ICategory } from '@modules/products/models/ICategory';
import { IProduct } from '@modules/products/models/IProduct';

import { ICreateProductDTO } from '../dtos/ICreateProductDTO';
import { IFindProductsByRestaurantIdDTO } from '../dtos/IFindProductsByRestaurantIdDTO';
import { IUpdateProductDTO } from '../dtos/IUpdateProductDTO';
import { IProductsRepository } from '../IProductsRepository';
import { FakeCategoriesRepository } from './FakeCategoriesRepository';
import { FakePromotionsRepository } from './FakePromotionsRepository';

type ProductEntity = {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  image: string | null;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

interface IRelations {
  promotions: FakePromotionsRepository;
  categories: FakeCategoriesRepository;
}

export class FakeProductsRepository implements IProductsRepository {
  private products: ProductEntity[];
  private relations: IRelations;

  constructor(
    promotionsRepository: FakePromotionsRepository,
    categoriesRepository: FakeCategoriesRepository,
  ) {
    this.products = [];
    this.relations = {
      promotions: promotionsRepository,
      categories: categoriesRepository,
    };
  }

  public async create({
    restaurantId,
    categoryId,
    name,
    price,
  }: ICreateProductDTO): Promise<Omit<IProduct, 'promotion' | 'category'>> {
    const product: ProductEntity = {
      id: uuid(),
      restaurantId,
      categoryId,
      name,
      image: null,
      price,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.push(product);

    const formattedProduct: Omit<IProduct, 'promotion' | 'category'> = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      imageUrl: null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return formattedProduct;
  }

  public async findAll({
    restaurantId,
    page,
    perPage,
  }: IFindProductsByRestaurantIdDTO): Promise<{
    count: number;
    products: IProduct[];
  }> {
    const foundProducts = this.products.filter(
      product => product.restaurantId === restaurantId,
    );

    const productsPage = foundProducts.slice(
      (page - 1) * perPage,
      page * perPage,
    );

    const productsPromises = productsPage.map(async product => {
      const category = (await this.relations.categories.findById({
        restaurantId,
        categoryId: product.categoryId,
      })) as ICategory;

      const promotion = await this.relations.promotions.findByProductId(
        product.id,
      );

      const formattedProduct: IProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        imageUrl: null,
        promotion,
        category,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };

      return formattedProduct;
    });

    const products = await Promise.all(productsPromises);

    return { count: this.products.length, products };
  }

  public async findOne({
    restaurantId,
    productId,
  }: {
    restaurantId: string;
    productId: string;
  }): Promise<IProduct | null> {
    const product = this.products.find(product => product.id === productId);

    if (!product) {
      return null;
    }

    const category = (await this.relations.categories.findById({
      restaurantId,
      categoryId: product.categoryId,
    })) as ICategory;

    const promotion = await this.relations.promotions.findByProductId(
      product.id,
    );

    const formattedProduct: IProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      imageUrl: null,
      promotion,
      category,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return formattedProduct;
  }

  public async update({
    productId,
    restaurantId,
    categoryId,
    name,
    price,
  }: IUpdateProductDTO): Promise<IProduct> {
    const productIndex = this.products.findIndex(
      product =>
        product.id === productId && product.restaurantId === restaurantId,
    );

    if (productIndex === -1) {
      throw new Error('Product does not exist.');
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...(categoryId ? { categoryId } : {}),
      ...(name ? { name } : {}),
      ...(price ? { price } : {}),
    };

    const formattedProduct = (await this.findOne({
      restaurantId,
      productId,
    })) as IProduct;

    return formattedProduct;
  }

  public async delete({
    restaurantId,
    productId,
  }: {
    restaurantId: string;
    productId: string;
  }): Promise<void> {
    this.products = this.products.filter(
      product =>
        product.id !== productId && product.restaurantId !== restaurantId,
    );
  }
}
