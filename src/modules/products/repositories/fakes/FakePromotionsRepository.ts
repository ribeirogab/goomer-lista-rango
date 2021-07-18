import { v4 as uuid } from 'uuid';

import { IPromotion } from '@modules/products/models/IPromotion';

import { ICreatePromotionDTO } from '../dtos/ICreatePromotionDTO';
import { IUpdatePromotionByProductIdDTO } from '../dtos/IUpdatePromotionByProductIdDTO';
import { IPromotionsRepository } from '../IPromotionsRepository';

type PromotionEntity = {
  id: string;
  productId: string;
  description: string | null;
  price: number;
  startDatetime: Date;
  finishDatetime: Date;
  createdAt: Date;
  updatedAt: Date;
};

export class FakePromotionsRepository implements IPromotionsRepository {
  private promotions: PromotionEntity[];

  constructor() {
    this.promotions = [];
  }

  public async create({
    productId,
    description,
    price,
    startDatetime,
    finishDatetime,
  }: ICreatePromotionDTO): Promise<IPromotion> {
    const promotion: PromotionEntity = {
      id: uuid(),
      productId,
      description: description || null,
      price,
      startDatetime,
      finishDatetime,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.promotions.push(promotion);

    const formattedPromotion: IPromotion = {
      id: promotion.id,
      description: promotion.description,
      price: promotion.price,
      startDatetime: promotion.startDatetime,
      finishDatetime: promotion.finishDatetime,
    };

    return formattedPromotion;
  }

  public async updateByProductId({
    productId,
    description,
    price,
    startDatetime,
    finishDatetime,
  }: IUpdatePromotionByProductIdDTO): Promise<IPromotion | null> {
    this.promotions = this.promotions.filter(
      promotion => promotion.productId !== productId,
    );

    const formattedPromotion = await this.create({
      productId,
      description,
      price,
      startDatetime,
      finishDatetime,
    });

    return formattedPromotion;
  }

  public async findByProductId(productId: string): Promise<IPromotion | null> {
    const foundPromotion = this.promotions.find(
      promotion => promotion.productId === productId,
    );

    return foundPromotion || null;
  }
}
