import apiService from "./apiService";

const filterSpecification = (uri, file) => {

  let data = new FormData();
  data.append("file", file);
  data.append("uri", uri);

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
  return apiService
    .post("/api/v1/specifications/filter", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      /// We don't have a valid response
      if (response.status != 200) {
        return "";
      }

      return response.data;
    });
};

export default filterSpecification;
