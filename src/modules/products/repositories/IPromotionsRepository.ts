import { IPromotion } from '../models/IPromotion';
import { ICreatePromotionDTO } from './dtos/ICreatePromotionDTO';
import { IUpdatePromotionByProductIdDTO } from './dtos/IUpdatePromotionByProductIdDTO';

export interface IPromotionsRepository {
  create({
    productId,
    description,
    price,
    startDatetime,
    finishDatetime,
  }: ICreatePromotionDTO): Promise<IPromotion>;

  updateByProductId({
    productId,
    description,
    price,
    startDatetime,
    finishDatetime,
  }: IUpdatePromotionByProductIdDTO): Promise<IPromotion | null>;

  findByProductId(productId: string): Promise<IPromotion | null>;
}
