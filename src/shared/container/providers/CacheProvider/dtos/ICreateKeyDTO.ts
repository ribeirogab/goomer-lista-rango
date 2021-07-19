export interface ICreateKeyDTO {
  prefix: string;
  params?: (string | number | undefined)[];
  identifier?: string;
}
