import apiRequest from "./api/apiRequest";

const updateMappingTerm = async (data) => {
  return await apiRequest({
    url: "/api/v1/mapping_terms/" + data.id,
    method: "put",
    payload: {
      mapping_term: data,
    },
  });
};

export default updateMappingTerm;
