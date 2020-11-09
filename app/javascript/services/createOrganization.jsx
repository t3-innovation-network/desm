import apiRequest from "./api/apiRequest";

const createOrganization = async (name) => {
  const response = await apiRequest({
    url: "/api/v1/organizations",
    method:"post",
    payload: {
      organization: {
        name: name,
      },
    }
  });
  return response;
};

export default createOrganization;
