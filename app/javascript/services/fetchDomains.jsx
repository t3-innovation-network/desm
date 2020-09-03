import apiService from "./apiService";

const fetchDomains = () => {
  return apiService
    .get("/api/v1/domains")
    .then((response) => {
    /// From each domain in the list, we only need the id and the name
    /// in a simpler way
    return response.data.map((domain) => {
      return {
        id: domain.uri,
        name: domain.pref_label
      }
    })
  })
}

export default fetchDomains;