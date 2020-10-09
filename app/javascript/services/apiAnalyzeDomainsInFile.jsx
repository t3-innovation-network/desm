import apiService from "./api/apiService";

const apiAnalyzeDomainsInFile = async (file) => {
  let data = new FormData();
  data.append("file", file);
  /**
   * Send the file to the api to analyze
   */
  try {
    const response = await apiService
      .post("/api/v1/specifications/info", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    /// We don't have a valid response, but it's not
    /// an internal server error (500)
    if (response.status != 200) {
      return [];
    }
    return response.data.domains;
  } catch (e) {
    throw new Error(e.response.data.message);
  }
};

export default apiAnalyzeDomainsInFile;
