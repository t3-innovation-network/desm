import apiRequest from './api/apiRequest';

const deleteMapping = async (alignmentId) => {
  return await apiRequest({
    url: '/api/v1/alignments/' + alignmentId,
    method: 'delete',
  });
};

export default deleteMapping;
