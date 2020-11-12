import apiRequest from "./api/apiRequest";

const mergeFiles = async (files) => {
  /// Prepare the data
  let data = new FormData();
  files.forEach(file => data.append("files[]", file));

  /// Send the files to the api to analyze
  const response = await apiRequest({
    url: "/api/v1/specifications/merge",
    method: "post",
    payload: data,
    deafultResponse: [],
    successResponse: "specification",
    options: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });
  return response;
};

export default mergeFiles;
