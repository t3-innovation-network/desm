import apiRequest from "./api/apiRequest";
/**
 * @param {file} file: The file to be filtered, in a JSON format.
 * @param {Array} uri: The list of identifiers of the rdfs:Class'es selected.
 */
const filterSpecification = async (uris, file) => {
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
    url: "/api/v1/specifications/filter",
    method: "post",
    payload: {
      file: JSON.stringify(file),
      uris: uris,
    },
    defaultResponse: "",
    successResponse: "filtered",
  });
};

export default filterSpecification;
