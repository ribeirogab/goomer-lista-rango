import { AddressEntity } from '@modules/addresses/infra/postgreSQL/entities/AddressEntity';

interface IRelations {
  addresses: typeof AddressEntity;
}

export class RestaurantAddressEntity {
  public static table = 'restaurant_addresses';
  public static relations: IRelations = {
    addresses: AddressEntity,
  };

  public restaurant_id: string;
  public address_postal_code: string;
  public number: string;

  public created_at: Date;
  public updated_at: Date;
}
