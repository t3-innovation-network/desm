import apiRequest from "./api/apiRequest";

const checkDomainsInFile = async (file) => {
  let data = new FormData();
  data.append("file", file);
  /// Send the file to the api to analyze
  const response = await apiRequest({
    url: "/api/v1/specifications/info",
    method: "post",
    payload: data,
    deafultResponse: [],
    successResponse: "domains",
    options: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });
  return response;
};

export default checkDomainsInFile;
