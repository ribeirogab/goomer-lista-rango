import { v4 as uuid } from 'uuid';

import { IPromotion } from '@modules/products/models/IPromotion';

import { ICreatePromotionDTO } from '../dtos/ICreatePromotionDTO';
import { IUpdatePromotionByProductIdDTO } from '../dtos/IUpdatePromotionByProductIdDTO';
import { IPromotionRepository } from '../IPromotionsRepository';

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

export class FakePromotionsRepository implements IPromotionRepository {
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
    const promotionIndex = this.promotions.findIndex(
      promotion => promotion.productId === productId,
    );

    if (promotionIndex === -1) {
      return null;
    }

    this.promotions[promotionIndex] = {
      ...this.promotions[promotionIndex],
      ...(description ? { description } : {}),
      ...(price ? { price } : {}),
      ...(startDatetime ? { startDatetime } : {}),
      ...(finishDatetime ? { finishDatetime } : {}),
    };

    const formattedPromotion: IPromotion = {
      id: this.promotions[promotionIndex].id,
      description: this.promotions[promotionIndex].description,
      price: this.promotions[promotionIndex].price,
      startDatetime: this.promotions[promotionIndex].startDatetime,
      finishDatetime: this.promotions[promotionIndex].finishDatetime,
    };

    return formattedPromotion;
  }

  public async findByProductId(productId: string): Promise<IPromotion | null> {
    const foundPromotion = this.promotions.find(
      promotion => promotion.productId === productId,
    );

    return foundPromotion || null;
  }
}
