import { IGetPageInfoDTO } from '../dtos/IGetPageInfoDTO';
import { IPaginationProvider, PageInfo } from '../models/IPaginationProvider';

export class FakePaginationProvider implements IPaginationProvider {
  public getPageInfo({
    total,
    perPage,
    currentPage,
  }: IGetPageInfoDTO): PageInfo {
    const pageInfo = {
      total,
      perPage,
      currentPage,
      lastPage: Math.ceil(total / perPage),
      hasNextPage: currentPage < Math.ceil(total / perPage),
    };

    return pageInfo;
  }
}
