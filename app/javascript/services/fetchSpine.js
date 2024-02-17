import apiRequest from './api/apiRequest';

const fetchSpine = async (id) => {
  return await apiRequest({
    url: `/api/v1/spine_specifications/${id}`,
    method: 'get',
    defaultResponse: {},
    successResponse: 'spine',
  });
};

export default fetchSpine;
