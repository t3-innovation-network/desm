import apiService from "./apiService";

const apiAnalyzeDomainsInFile = (file) => {
  let data = new FormData();
  data.append("file", file);
  /**
   * In a first instance, the UI work will rely on this hardcoded values
   * from schema.org specification.
   *
   * In the next commit, it will reach the  api service to get the real
   * values for the domains found in the file.
   */
  return apiService
  .post('/api/v1/specifications/info', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then((response) => {
      /// We don't have a valid response
      if (response.status != 200) {
        return [];
      }

      return response.data.domains;
    });
};

export default apiAnalyzeDomainsInFile;
