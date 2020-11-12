import apiRequest from "./api/apiRequest";

const createSpec = async (data) => {
  const response = await apiRequest({
    url: "/api/v1/specifications",
    method: "post",
    payload: {
      specification: {
        name: data.name,
        version: data.version,
        use_case: data.useCase,
        domain_to: data.domainTo,
        domain_from: data.domainFrom,
        content: JSON.stringify(data.specification),
      }
    },
  });
  return response;
};

export default createSpec;
