import apiRequest from './api/apiRequest';

const deleteTerm = async (term_id) => {
  return await apiRequest({
    url: '/api/v1/terms/' + term_id,
    method: 'delete',
  });
};

export default deleteTerm;
