import { IPromotion } from '@modules/products/models/IPromotion';

export class PromotionEntity {
  public static table = 'promotions';

  public id: string;
  public product_id: string;
  public description: string | null;
  public price: number;
  public start_datetime: Date;
  public finish_datetime: Date;

  public created_at: Date;

  private static formatDate(date: Date): {
    year: number;
    month: number;
    day: number;
    time: string;
    datetime: Date;
  } {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const time = `${date.getHours()}:${String(date.getMinutes()).padStart(
      2,
      '0',
    )}`;

    return {
      year,
      month,
      day,
      time,
      datetime: date,
    };
  }

  public static formatPromotion(promotion: PromotionEntity): IPromotion {
    const formattedPromotion: IPromotion = {
      id: promotion.id,
      description: promotion.description,
      price: promotion.price,
      startsAt: this.formatDate(new Date(promotion.start_datetime)),
      finishAt: this.formatDate(new Date(promotion.finish_datetime)),
    };

    return formattedPromotion;
  }
}
