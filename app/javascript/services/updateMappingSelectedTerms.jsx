import apiRequest from './api/apiRequest';

const updateMappingSelectedTerms = async (data) => {
  return await apiRequest({
    url: '/api/v1/mappings/' + data.mappingId + '/selected_terms',
    method: 'post',
    payload: {
      term_ids: data.termIds,
    },
  });
};

export default updateMappingSelectedTerms;
