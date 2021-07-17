import { IPromotion } from '../models/IPromotion';
import { ICreatePromotionDTO } from './dtos/ICreatePromotionDTO';
import { IUpdatePromotionByProductIdDTO } from './dtos/IUpdatePromotionByProductIdDTO';

export interface IPromotionRepository {
  create({
    productionId,
    description,
    price,
    startDatetime,
    finishDatetime,
  }: ICreatePromotionDTO): Promise<IPromotion>;

  updateByProductId({
    productionId,
    description,
    price,
    startDatetime,
    finishDatetime,
  }: IUpdatePromotionByProductIdDTO): Promise<IPromotion>;
}
