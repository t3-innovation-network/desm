import apiRequest from './api/apiRequest';

const deleteSpecification = async (term_id) => {
  return await apiRequest({
    url: '/api/v1/specifications/' + term_id,
    method: 'delete',
  });
};

export default deleteSpecification;
