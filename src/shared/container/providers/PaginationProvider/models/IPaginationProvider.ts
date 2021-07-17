import { IGetPageInfoDTO } from '../dtos/IGetPageInfoDTO';

export type PageInfo = {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
};

export interface IPaginationProvider {
  getPageInfo(data: IGetPageInfoDTO): PageInfo;
}
