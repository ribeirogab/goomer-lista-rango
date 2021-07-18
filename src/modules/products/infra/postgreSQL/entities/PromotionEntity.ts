export class PromotionEntity {
  public static table = 'promotions';

  public id: string;
  public product_id: string;
  public description: string | null;
  public price: number;
  public start_datetime: Date;
  public finish_datetime: Date;

  public created_at: Date;
  public updated_at: Date;
}
