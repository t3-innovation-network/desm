import apiRequest from './api/apiRequest';

const checkDomainsInFile = async (fileId) => {
  /// Send the file to the api to analyze
  const response = await apiRequest({
    url: '/api/v1/merged_files/' + fileId + '/classes',
    method: 'post',
    defaultResponse: [],
    successResponse: 'domains',
  });
  return response;
};

export default checkDomainsInFile;
