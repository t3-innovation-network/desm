import apiService from "./api/apiService";

const createSpec = async (data) => {
  const response = await apiService
    .post("/api/v1/specifications", {
        name: data.name,
        version: data.version,
        use_case: data.useCase,
        domain_to: data.domainTo,
        domain_from: data.domainFrom,
        specifications: data.specifications
      });
  return response.data;
};

export default createSpec;
