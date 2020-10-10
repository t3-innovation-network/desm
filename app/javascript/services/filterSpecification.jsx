import apiRequest from "./api/apiRequest";

const filterSpecification = async (uri, file) => {
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
  return await apiRequest({
    url: "/api/v1/specifications/filter",
    method: "post",
    payload: data,
    options: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    defaultResponse: "",
    successResponse: "specification",
  });
};

export default filterSpecification;
