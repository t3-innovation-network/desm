import apiService from "./apiService";

const createMapping = async (specification_id) => {
  const response = await apiService
    .post("/api/v1/mappings", {
      specification_id: specification_id
    });
  return response;
};

export default createMapping;
