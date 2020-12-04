import apiRequest from "./api/apiRequest";

const createSpec = async (data) => {
  /// Do the request
  const response = await apiRequest({
    url: "/api/v1/specifications",
    method: "post",
    payload: {
      specification: {
        content: JSON.stringify(data.specification),
        domain_from: data.domainFrom,
        domain_id: data.domainId,
        name: data.name,
        scheme: data.scheme,
        use_case: data.useCase,
        version: data.version,
      },
    },
  });
  return response;
};

export default createSpec;
