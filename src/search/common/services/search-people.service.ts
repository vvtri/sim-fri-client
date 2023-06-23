import axiosClient from '../../../common/configs/axios.config';
import { searchPeopleUrl } from '../apis/search.api';
import { ISearchPeopleReq } from '../interfaces/req/search-people.req.interface';
import { ISearchPeopleRes } from '../interfaces/res/search-people.req.interface';

export const searchPeople = async (params: ISearchPeopleReq) => {
  return axiosClient.get<any, ISearchPeopleRes>(searchPeopleUrl, { params });
};
