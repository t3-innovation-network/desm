import apiRequest from './api/apiRequest';
/**
 * @param {Integer} mergedFileId: The id of the file to be filtered.
 * @param {Array} uri: The list of identifiers of the rdfs:Class'es selected.
 */
const filterSpecification = async (uris, mergedFileId) => {
  /**
   * This will be the way to get the specification file
   * parsed to get only 1 domain to map from.
   *
   * The api will be in charge of the filtering, since
   * it's not a simple task, it will first remove all the
   * classes that were not selected in the 'pick domain'
   * step, the keep only the properties that are related to
   * the selected class or those that are related to a propesrty
   * that's also related to the selected class and so on.
   */
  return await apiRequest({
    url: '/api/v1/merged_files/' + mergedFileId + '/filter',
    method: 'post',
    payload: {
      uris: uris,
    },
    defaultResponse: '',
    successResponse: 'filtered',
  });
};

export default filterSpecification;
