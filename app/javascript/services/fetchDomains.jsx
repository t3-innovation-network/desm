import apiRequest from "./api/apiRequest";

const fetchDomains = async () => {
  const response = await apiRequest({
    url: "/api/v1/domains",
    method: "get",
    successResponse: "domains"
  });

  if(!response.error){
    return {
      domains: response.domains.map((domain) => {
        return {
          id: domain.uri,
          name: domain.pref_label,
          spine: domain.spine_id !== null,
        };
      }),
    };
  }
  return response;
};

export default fetchDomains;
