import apiRequest from "./api/apiRequest";

const fetchMappings = async (filter) => {
  return await apiRequest({
    url: "/api/v1/mappings",
    method: "get",
    payload: {
      params: {
        user: filter,
      },
    },
    successResponse: "mappings",
  });
};

export default fetchMappings;
