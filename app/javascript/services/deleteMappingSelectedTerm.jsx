import apiRequest from './api/apiRequest';

const deleteMappingSelectedTerm = async (data) => {
  return await apiRequest({
    url: '/api/v1/mappings/' + data.mappingId + '/selected_terms',
    method: 'delete',
    payload: {
      term_id: data.termId,
    },
  });
};

export default deleteMappingSelectedTerm;
