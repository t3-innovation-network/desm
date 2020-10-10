import apiRequest from "./api/apiRequest";

const updateOrganization = async (organization_id, name) => {
  return await apiRequest({
    url: "/api/v1/organizations/" + organization_id,
    method: "put",
    payload: {
      organization: {
        name: name,
      },
    },
  });
};

export default updateOrganization;
