import apiRequest from "./api/apiRequest";

const checkDomainsInFile = async (file) => {
  /// Send the file to the api to analyze
  const response = await apiRequest({
    url: "/api/v1/specifications/info",
    method: "post",
    payload: {
      file: JSON.stringify(file),
    },
    defaultResponse: [],
    successResponse: "domains",
  });
  return response;
};

export default checkDomainsInFile;
