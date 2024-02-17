import apiRequest from './api/apiRequest';

const fetchSpineSpecifications = async (filter) => {
  return await apiRequest({
    url: '/api/v1/spine_specifications' + (filter ? '?filter=' + filter : ''),
    method: 'get',
    successResponse: 'specifications',
  });
};

export default fetchSpineSpecifications;
