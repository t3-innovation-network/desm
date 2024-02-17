import apiRequest from './api/apiRequest';

const createMapping = async (specification_id) => {
  const response = await apiRequest({
    url: '/api/v1/mappings',
    method: 'post',
    successResponse: 'mapping',
    payload: {
      specification_id: specification_id,
    },
  });
  return response;
};

export default createMapping;
